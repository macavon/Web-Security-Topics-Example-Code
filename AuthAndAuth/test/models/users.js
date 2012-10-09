var DBWrapper = require('node-dbi').DBWrapper;

var db = new DBWrapper('sqlite3', {
	path: __dirname + '/../../db/test.sqlite3'
});
db.connect();

var util = require('util'),
    should = require('should');

var User = require('../../models/users.js')(db);

describe('saving one', function(done){
  var aUser = new User({email: 'a_user@somedomain.com.fd', password: '3yellowLegs'});  
  it('should save without error', function(done){
    aUser.save(done);
  })
})

var abe = new User({email:'ABELIUM@abelardos.com.fd', password: 'Passwurd123'}),
    gwendolen = new User({email:'gwendolen@abelardos.com.fd', password: 'Passwurd123'}),
    zak = new User({email:'zachary@abelardos.com.fd', password: 'Passwurd123'}),
    zak2 = new User({email:'zachary@abelardos.com.fd', password: 'Passwurd1232'}),
    sid = new User({email:'sidney@abelardos.com.fd', password: 'Passwurd123'}),
    dolores = new User({email:'dolores@abelardos.com.fd', password: 'Passwurd123'}),
    cynthia = new User({email:'cynthia@abelardos.com.fd', password: 'Passwurd123'});

var credentialsAreRejected = function(e, pw) {
  return function(done) {
    it('should be rejected', function(done){
      var nogood = new User({email:e, password: pw});
      nogood.save(function(err) {
        err.should.not.equal(null);
        done();
      });
    })
  }
};

var credentialsAreAccepted = function(e, pw) {
  return function(done) {
    it('should be accepted', function(done){
      var good = new User({email:e, password: pw});
      good.save(function(err) {
        should.not.exist(err);
        done();
      });
    })
  }
};

var passwordIsRejected = function(pw) {
	return credentialsAreRejected('ABELIUM@abelardos.com', pw);
};

var emailIsRejected = function(e) {
  return credentialsAreRejected(e, 'iam2Fish');
};

var emailIsAccepted = function(e) {
  return credentialsAreAccepted(e, 'iam2Fish');
};

describe('Users:', function(done) {
    
  after(function(done) {
    db.query('delete from users', [],  done)
  })
      
  describe('Abelardo', function(done){
    before(function(done){
      abe.save(done);
    })
  
    it('should not be old', function(){
      abe.isNew().should.be.false;
    })
    it('should have a hashed password', function(){
      abe._passwordHash.should.not.equal('Passwurd123');
    })
    it('should have his password recognized', function(){
      abe.checkPassword('Passwurd123').should.be.true;
    })
    it('should have another password rejected', function(){
      abe.checkPassword('Passwurd1234').should.be.false;
    })
  })
      
  describe('Lady Gwendolen', function(done){
    before(function(done){
      gwendolen.save(done);
    })
    
    describe('retrieval', function(done){
      it('should find her again', function(done) {
        User.findByEmail('gwendolen@abelardos.com.fd', function(err, u) {
            u.email.should.equal('gwendolen@abelardos.com.fd');
            done();
        })
      });
    })
    
    describe('valid credentials', function(done) {
      it('should be accepted', function(done){
        User.checkCredentials('gwendolen@abelardos.com.fd', 'Passwurd123', function(err, u) {
          should.not.exist(err);
          u.email.should.equal('gwendolen@abelardos.com.fd');
          done();
        })
      })
    })
    
    describe('invalid password', function(done) {
      it('should be rejected', function(done){
        User.checkCredentials('gwendolen@abelardos.com.fd', 'Passwurd1234', function(err, u) {
          should.exist(err);
          err.message.should.equal('incorrect password');
          done();
        })
      })
    })

    describe('invalid email', function(done) {
      it('should be rejected', function(done){
        User.checkCredentials('gwendolene@abelardos.com.fd', 'Passwurd123', function(err, u) {
          should.exist(err);
          err.message.should.equal('unknown user');
          done();
        })
      })
    })

    describe('short password', passwordIsRejected('m3Fi'));
    describe('no digits', passwordIsRejected('Passwurdddd'));
    describe('no upper case', passwordIsRejected('iam2fish'));
    describe('no lower case', passwordIsRejected('IAM2FISH'));
    describe('missing password', passwordIsRejected(''));
    describe('missing email address', emailIsRejected(''));
    describe('long email address', emailIsRejected('ABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUMABELIUM'));
    describe('bad email address', emailIsRejected('abelardos.com'));
    describe('bad TLD', emailIsRejected('abe@abelardos.comdominium'));
    describe('special TLD', emailIsAccepted('abe@abelardos.museum'));

  })
  
  describe('duplicate user', function(done){
    it('should not be allowed', function(done){
      zak.save(function(err) { zak2.save(function(err) {
        should.exist(err);
        done();
      })})
    })
  })

  describe('updates', function(done){
    before(function(done){
      sid.save(done);
    })
    
    it('should be ok to change his password', function(done){
      sid.password = 'WurdPass321';
      sid.save(function(err) {
        User.checkCredentials('sidney@abelardos.com.fd','WurdPass321', function(err, u) {
          should.not.exist(err);
          u.email.should.equal('sidney@abelardos.com.fd');
          done();
        })
      })
    })
    
    it('should be ok to change his email', function(done){
      sid.email = 'ss@abelardos.com.fd';
      sid.save(function(err) {
        User.checkCredentials('ss@abelardos.com.fd','WurdPass321', function(err, u) {
          should.not.exist(err);
          u.email.should.equal('ss@abelardos.com.fd');
          done();
        })
      })
    })
    
    it('should not be ok to change his email to somebody else\'s', function(done){
      sid.email = 'ABELIUM@abelardos.com.fd';
      sid.save(function(err) {
          should.exist(err);
          err.message.should.include('constraint failed');
          done();
      })
    })
  })

})

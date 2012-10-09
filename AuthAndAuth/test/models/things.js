var DBWrapper = require('node-dbi').DBWrapper;

var db = new DBWrapper('sqlite3', {
	path: __dirname + '/../../db/test.sqlite3'
});
db.connect();

var util = require('util'),
    should = require('should');

var Thing = require('../../models/things.js')(db);

describe('saving one', function(done){
  var aThing = new Thing({numberOfLegs: 4, colour: 'yellow'});
  it('should save without error', function(done){
    aThing.save(done);
  })
})


var firstThing = new Thing({numberOfLegs: 7, colour: 'green'});
var secondThing = new Thing({numberOfLegs: 6, colour: 'pink'});
var thirdThing = new Thing({numberOfLegs: 12, colour: 'purple'});

var firstId;

describe('a bunch of things', function(done){
  before(function(done){

    db.query('delete from things', [], function(err) {
      firstThing.save(function(err){
        firstId = firstThing.id;
        secondThing.save(function(err){
          thirdThing.save(done);
        })
      })
    })
  })
    
  after(function(done) {
    db.query('delete from things', [],  done)
  })
    
  describe('counting', function(done){
    it('should come to three things', function(done){
      Thing.count(function(err, n) {
        n.should.equal(3);
        done()
      })
    })
  })
  
  describe('finding by id', function(done){
    it('should find one thing', function(done){
      Thing.findById(firstId, function(err, t) {
        t.id.should.equal(firstId);
        done()
      })
    })
  })
  
  describe('finding pink things', function(done){
    it('should find one thing with 6 legs', function(done){
      Thing.findByColour('pink', function(err, ts) {
        ts.length.should.equal(1);
        ts[0].numberOfLegs.should.equal(6);
        done()
      })
    })
  })
  
  describe('finding leggy things', function(done){
    it('should find two things with >6 legs', function(done){
      Thing.findByMinimumNumberOfLegs(7, function(err, ts) {
        ts.length.should.equal(2);
        done()
      })
    })
  })
  
  describe('deleting a thing', function(done){
    it('should leave two things', function(done){
      Thing.destroy(firstId, function(err) {
        Thing.count(function(err, n) {
          n.should.equal(2);
          done()
        })
      })
    })
  })
  
})

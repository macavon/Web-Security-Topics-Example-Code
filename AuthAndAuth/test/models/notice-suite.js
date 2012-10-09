var vows = require('vows'),
    assert = require('assert');

var DBWrapper = require('node-dbi').DBWrapper;

var db = new DBWrapper('sqlite3', {
	path: __dirname + '/../../db/test.sqlite3'
});

var util = require('util');

var Notice = require('../../models/notices.js')(db);
var User = require('../../models/users.js')(db);
var persistentNotice = require('../../lib/persistent_objects')(Notice);

var abe, abes_notice, nid, creation_time;

var findById = function (id, callback) {
  persistentNotice.findOneObject('id = ?', [id], callback);
  // db.fetchRow('select * from notices where id = ?', id, function(err, r) {
  //   callback(err, Notice.recreate(r));
  // });
}

var allNotices = function(callback) {
  persistentNotice.findAnyObjects(callback);
}
// var allNotices = function(callback) {
//   db.fetchAll('select * from notices', [], function(err, rs) {
//     callback(err, rs.map(function(r, i, o) { return Notice.recreate(r); }))
//   })
// };

db.connect();

vows.describe('notice').addBatch({
  'creation': {
    topic: function() {
      var self = this;
			abe = new User({email:'absalom@abelardos.com', password: 'iam2Fish'});
      abe.save(function(err) {
        abes_notice = new Notice({heading: 'Hey!',
                                  body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                                  ownerId: abe.id});
        abes_notice.save(self.callback)
      })
    },
		'it was saved': function(err) {
			assert.isFalse(abes_notice.isNew());
    },
    'with an id': function(err) {
      assert.isNumber(abes_notice.id);
		},
    'then retrieval': {
      topic: function() {
        var self = this;
        nid = abes_notice.id;
        findById(nid, self.callback);
      },
      'it was found': function(err, n) {
        assert.equal(n.id, nid);
      },
      'it was defined': function(err, n) {
        assert.isDefined(n);
      },
      'it was not new': function(err, n) {
        assert.isFalse(n.isNew());
      },
      'with heading intact': function(err, n) {
        assert.equal(n.heading, 'Hey!');
      },
      'with a good name on it': {
        topic: function() {
          var self = this;
          abes_notice.poster(self.callback);
        },
        'from the user':function(err, p) {
          assert.equal(p, 'absalom');
        }
      }
    },
    'and updating': {
      topic: function() {
        var self = this;
        findById(nid, function(err, n) {
          n.heading = 'Ho!';
          creation_time = n.createdAt;
          setTimeout(function() {
            n.save(self.callback)}, 1500)
        })
      },
      'it changed': function(err, n) {
        assert.notEqual(n.heading, 'Hey!')
      },
      'subsequent retrieval':{
        topic: function() {
          var self = this;
          findById(nid, self.callback);
        },
        'it was found': function(err, n) {
        assert.equal(n.id, nid);
        },
        'it was defined': function(err, n) {
          assert.isDefined(n);
        },
        'it changed as expected': function(err, n) {
          assert.equal(n.heading, 'Ho!');
        },
        'it changed the modification time': function(err, n) {
          assert.notEqual(n.updatedAt, creation_time)
        }
      }
    }
  }
}).addBatch({
  'several notices': {
    topic: function() {
      var self = this;
      n2 = new Notice({heading: '2', body: 'second notice', ownerId: abe.id});
      n3 = new Notice({heading: '3', body: 'third notice', ownerId: abe.id});
      n2.save(function() {n3.save(function() {allNotices(self.callback)})});
    },
    'now there are three': function(err, rs) {
      assert.equal(rs.length, 3);
    },
    'and they are the right three': function(err, rs) {
      var hs = rs.map(function(n, i, o) { return n.heading });
      assert.include(hs, 'Ho!');
      assert.include(hs, '2');
      assert.include(hs, '3');
    }
  }
}).addBatch({
  'finish off': {
    topic: function() {
      var self = this;
      db.query('delete from notices', [], function() {
        db.query('delete from users', [], self.callback);
      })
    },
    'gone': function(err, n) {
      console.log('closing down\n');
    }
  }
}).export(module);
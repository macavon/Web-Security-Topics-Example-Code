var app = require('../app');

module.exports = {
	// SQLite doesn't need most of the possible fields
	path: __dirname + '/' + app.set('dbname') + '.sqlite3'
}
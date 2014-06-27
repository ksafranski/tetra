var config = require('./../../conf/service.json');
var mongo = require('mongoskin');

// Constructor
var Conn = function () {

  // DB Setup
  this.db = mongo.db(config.conn.user+':'+config.conn.pass+'@'+config.conn.host+'/'+config.conn.db);

};

Conn.prototype.find = function () {
  
};

Conn.prototype.create = function () {
  
};

Conn.prototype.update = function () {
  
};

Conn.prototype.delete = function () {
  
};

module.exports = Conn;
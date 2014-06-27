var config = require('./../../conf/service.json');
var mongo = require('mongoskin');

// Constructor
var Conn = function () {

  // DB Setup
  this.db = mongo.db(config.conn.user+':'+config.conn.pass+'@'+config.conn.host+'/'+config.conn.db);

};

Conn.prototype.find = function (coll, query, cb) {
  var self = this;
  self.db.collection(coll).find(query).toArray(function (err, docs) {
    cb(err, docs);
    self.db.close();
  });
};

Conn.prototype.create = function (coll, data, cb) {
  var self = this;
  self.db.collection(coll).insert(data, function (err) {
    cb(err);
    self.db.close();
  });
};

Conn.prototype.update = function (coll, query, data, cb) {
  var self = this;
  self.db.collection(coll).update(query, data, function (err, docs) {
    cb(err, docs);
    self.db.close();
  });
};

Conn.prototype.delete = function (coll, query, cb) {
  var self = this;
  self.db.collection(coll).remove(query, function (err) {
    cb(err);
    self.db.close();
  });
};

module.exports = Conn;
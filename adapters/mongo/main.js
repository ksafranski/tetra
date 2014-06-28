var config = require('./../../conf/service.json');
var mongoskin = require('mongoskin');
var ObjectID = require('mongoskin').ObjectID;

// DozerJS NeDB component
var Conn = function () {
  this.store = mongoskin.db(config.conn.host, {
    username: config.conn.user,
    password: config.conn.pass,
    database: config.comm.db,
    safe: false
  });
};

// Correctly formats ID values
Conn.prototype.formatIds = function (query) {
  if (query.hasOwnProperty('_id')) {
    query._id = ObjectID.createFromHexString(query._id);
  }
  return query;
};

// Returns count of fields based on query
Conn.prototype.count = function (coll, query, cb) {
  var self = this;
  try {
    query = self.formatIds(query);
  } catch (err) {
    cb(null, 0);
    return;
  }
  self.store.collection(coll).count(query, function (err, data) {
    cb(err, data);
  });
};

// Finds specific entry
Conn.prototype.find = function (coll, cursor, query, cb) {
  var self = this;
  try {
    query = self.formatIds(query);
  } catch (e) {
    cb(false, []);
    return;
  }
  // Set skip
  var skip = (cursor.page === 1) ? 0 : (cursor.count*(cursor.page-1))-1;
  self.store.collection(coll).find(query, null, { limit: cursor.count, skip: skip }).toArray(function (err, data) {
    cb(err, data);
  });
};

// Inserts new record, generates _id
Conn.prototype.insert = function (coll, data, cb) {
  var self = this;
  try {
    data = self.formatIds(data);
  } catch (e) {
    cb('Invalid _id provided');
    return false;
  }
  self.store.collection(coll).insert(data, function (err, data) {
    cb(err, data);
  });
};

// Updates existing record
Conn.prototype.update = function (coll, query, data, cb) {
  var self = this;
  try {
    query = self.formatIds(query);
    data = self.formatIds(data);
  } catch (e) {
    cb('Invalid _id provided');
    return false;
  }
  self.store.collection(coll).update(query, { $set: data }, function (err, data) {
    cb(err, data);
  });
};

// Removes existing record
Conn.prototype.remove = function (coll, query, cb) {
  var self = this;
  try {
    query = self.formatIds(query);
  } catch (e) {
    cb('Invalid _id provided');
    return false;
  }
  self.store.collection(coll).remove(query, function (err, data) {
    cb(err, data);
  });
};

module.exports = Conn;
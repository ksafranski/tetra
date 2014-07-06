var Datastore = require('nedb');
var config = require('./../../../libs/config');
var fs = require('fs');
/* jshint unused: false */
var Conn = function () {
  // Set store object
  this.store = {};
  // Set base
  this.base = __dirname + '/../../../' + config.service.documents.path;
  // Ensure directory exists
  if (!fs.existsSync(this.base)) {
    // No? Well build it...
    fs.mkdirSync(this.base);
  }
};

// Sets the current store
Conn.prototype.setStore = function (coll) {
  this.store = new Datastore({
    filename: this.base + coll + '.db',
    autoload: true
  });
};

Conn.prototype.find = function (coll, cursor, query, orderby, cb) {
  // Set store
  this.setStore();
};

Conn.prototype.insert = function (coll, data, cb) {
  this.setStore(coll);
  // Insert
  this.store.insert(data, function (err, data) {
    if (err) {
      cb({
        code: 500,
        message: err
      });
      return false;
    }
    // Success
    cb(false, data);
  });
};

Conn.prototype.update = function (coll, query, data, cb) {
  // Set store
  this.setStore(coll);
  // Update
  this.store.update(query, {
    $set: data
  }, {
    multi: true
  }, function (err) {
    if (err) {
      cb({
        code: 500,
        message: err
      });
      return false;
    }
    // Success
    cb(false);
  });
};

Conn.prototype.remove = function (coll, query, cb) {
  // Set store
  this.setStore(coll);
  // Remove
  this.store.remove(query, {
    multi: true
  }, function (err) {
    if (err) {
      cb({
        code: 500,
        message: err
      });
      return false;
    }
    // Success
    cb(false);
  });
};

module.exports = Conn;

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
  // coll => Collection name / table
  // cursor => Object: { page: N, limit: N }
  // query => Query object (JSON) passed through the API request
  // orderby => Orderby object (JSON) passed through API request
  // cb => Callback which accepts (err, data) as arguments:
  //         err: { code: 404, message: 'Not found' } -or- false,
  //         data: Return data object, no envelope
};

Conn.prototype.insert = function (coll, data, cb) {
  // coll => Collection name / table
  // data => Valid JSON object
  // cb => Callback which accepts (err, data) as arguments:
  //         err: { code: 404, message: 'Not found' } -or- false,
  //         data: Return data object, no envelope
  this.setStore(coll);
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
  // coll => Collection name / table
  // query => Query object (JSON) passed through the API request
  // data => Valid JSON object
  // cb => Callback which accepts (err, data) as arguments:
  //         err: { code: 404, message: 'Not found' } -or- false,
  //         data: Return data object, no envelope
  this.setStore(coll);
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
  // coll => Collection name / table
  // query => Query object (JSON) passed through the API request
  // cb => Callback which accepts (err, data) as arguments:
  //         err: { code: 404, message: 'Not found' } -or- false,
  //         data: Return data object, no envelope
  this.setStore(coll);
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

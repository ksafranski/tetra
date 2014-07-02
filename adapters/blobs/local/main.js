/* jshint unused: false */
var config = require('./../../../libs/config');
var fs = require('fs');
var path = require('path');

var Conn = function () {
  this.base = './../../../' + config.service.blobs.path;
};

Conn.prototype.find = function (blob, cb) {
  // Check exists
  if (!fs.existsSync(this.base + blob)) {
    cb('Blob not found');
  } else {
    cb(path.resolve(false, this.base + blob));
  }
};

Conn.prototype.create = function (name, blob, cb) {

};

Conn.prototype.update = function (name, blob, cb) {

};

Conn.prototype.remove = function (name, cb) {

};

module.exports = Conn;

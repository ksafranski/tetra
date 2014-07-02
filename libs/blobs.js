var multiparty = require('multiparty');
var config = require('./config');
var fs = require('fs');

module.exports = function (req, res) {

  var self = this;
  var Conn;
  var adapters = __dirname + '/../adapters/blobs/';
  var params = req.params[0].split('/');
  var blob = params[1];

  // Ensure connection settings
  if (!config.service.hasOwnProperty('blobs')) {
    self.respond(500, 'No blob connection specified');
    return false;
  }

  // Ensure adapter
  if (!config.service.blobs.hasOwnProperty('adapter') || !fs.existsSync(adapters + config.service.blobs.adapter + '/main.js')) {
    self.respond(500, 'Missing connection adapter: ' + adapters + config.service.blobs.adapter + '/main.js');
    return false;
  }

  // Load adapter
  Conn = require('./../adapters/blobs/' + config.service.blobs.adapter + '/main.js');
  // Instantiate db instance
  var store = new Conn();

  // Create form object
  var form = new multiparty.Form();

  // Retrieve a blob
  var read = function () {
    if (!blob) {
      // Needs to define a blob
      self.respond(404, 'No blob specified');
    }

    store.find(blob, function (err, data) {
      if (err) {
        self.respond(err.code, err.message);
      } else {
        res.sendfile(data);
      }
    });
  };

  // Create new blob
  var create = function () {
    // Parse multipart form
    form.parse(req, function (err, fields, files) {
      // Handle err
      if (err) {
        self.respond(500, err);
        return false;
      }

      // Get data
      var name = fields.name[0];
      var file = files.blob[0];

      store.create(name, file, function (err) {
        if (err) {
          self.respond(err.code, err.message);
        } else {
          res.header('Location', self.uri + name);
          self.respond(201);
        }
      });

    });
  };

  // Update existing blob
  var update = function () {
    // Parse multiparty form
    form.parse(req, function (err, fields, files) {
      // Handle error
      if (err) {
        self.respond(500, err);
        return false;
      }

      // Get data
      var name = (fields.hasOwnProperty('name')) ? fields.name[0] : false;
      var file = (files.hasOwnProperty('blob')) ? files.blob[0] : false;

      store.update(blob, name, file, function (err) {
        if (err) {
          self.respond(err.code, err.message);
        } else {
          self.respond(200);
        }
      });

    });

  };

  // Delete blob
  var del = function () {
    store.remove(blob, function (err) {
      if (err) {
        self.respond(err.code, err.message);
      } else {
        self.respond(204);
      }
    });
  };

  // Check method
  switch (req.method) {
  case 'GET':
    read();
    break;
  case 'POST':
    create();
    break;
  case 'PUT':
    update();
    break;
  case 'DELETE':
    del();
    break;
  default:
    // Unsupported method
    self.respond(405);
    return false;
  }

};

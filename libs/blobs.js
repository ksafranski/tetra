var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');

module.exports = function (req, res) {

  var self = this;

  var base = __dirname + '/../blobs/';

  var params = req.params[0].split('/');
  var blob = params[1];

  // Retrieve a blob
  var read = function () {
    if (!blob) {
      // Needs to define a blob
      self.respond(404, 'No blob specified');
    }
    // Check exists
    if (!fs.existsSync(base + blob)) {
      self.respond(404);
      return false;
    }
    // Success
    res.sendfile(path.resolve(base + blob));
  };

  // Create new blob
  var create = function () {
    var form = new multiparty.Form();

    // Parse multiparty form
    form.parse(req, function (err, fields, files) {
      // Get data
      var name = fields.name[0];
      var file = files.blob[0];

      // Ensure blob DNE
      if (fs.existsSync(base + name)) {
        self.respond(409, 'Blob already exists');
        return false;
      }

      fs.rename(file.path, base + name, function (err) {
        if (err) {
          self.respond(500, err);
          return false;
        }
        // Success
        self.respond(201);
      });

    });
  };

  // Update existing blob
  var update = function () {
    // Get file and name
    var file = req.files.blob;
    var name = req.body.name;
    // Check that blob exists
    if (!fs.exists(base + blob)) {
      self.respond(404);
      return false;
    }

    // Vars
    var pathOld, pathNew;

    if (!file && name) {
      // Rename
      pathOld = base + blob;
      pathNew = base + name;
    } else if (file && !name) {
      // Replace
      pathOld = base + file;
      pathNew = base + blob;
    } else if (file && name) {
      // Both
      pathOld = base + file;
      pathNew = base + name;
    } else {
      // Huh?
      self.respond(400, 'No condition matches request');
      return false;
    }

    // Process
    fs.rename(pathOld, pathNew, function (err) {
      if (err) {
        self.respond(500, err);
        return false;
      }
      // Success
      self.respond(200);
    });
  };

  // Delete blob
  var del = function () {
    // Check that blob exists
    if (!fs.exists(base + blob)) {
      self.respond(404);
      return false;
    }
    // Delete
    fs.unlink(base + blob, function (err) {
      if (err) {
        self.respond(500, err);
        return false;
      }
      // Success
      self.respond(200);
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

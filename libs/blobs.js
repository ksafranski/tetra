var fs = require('fs');

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
    res.sendfile(base + blob);
  };

  // Create new blob
  var create = function () {
    // Get file and name
    var file = req.files.blob;
    var name = req.body.name;

    // Ensure blob DNE
    if (fs.existsSync(base + name)) {
      self.respond(409, 'Blob already exists');
      return false;
    }

    // Move file
    fs.rename(file.path, base + name, function (err) {
      if (err) {
        self.respond(500, err);
        return false;
      }
      // Success
      self.respond(201);
    });
  };

  // Update existing blob
  var update = function () {

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

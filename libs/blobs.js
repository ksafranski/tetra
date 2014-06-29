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
    res.download(base + blob);
  };

  // Create new blob
  var create = function () {

  };

  // Update existing blob
  var update = function () {

  };

  // Delete blob
  var del = function () {

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

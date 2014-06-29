module.exports = function (req) {

  var self = this;

  // Retrieve a blob
  var read = function () {

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

module.exports = function (req) {
  var self = this;

  // Get/Check session data
  var read = function () {

  };

  // Authenticate, create new session
  var create = function () {

  };

  // Delete current session
  var del = function () {

  };

  switch (req.method) {
  case 'GET':
    read();
    break;
  case 'POST':
    create();
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

var passwordHash = require('password-hash');
var Datastore = require('nedb');

module.exports = function (req, res, next) {

  // Split params
  var params = req.params[0].split('/');

  // Get type
  var type = params[0];

  // Pass-through for session authentication
  if (type === 'session' && req.method === 'POST') {
    next();
    return false;
  }

  // Check for session auth
  if (req.session.user) {
    // Ensure type
    if (!res.session.user.hasOwnProperty('type')) {
      res.send(401, 'Invalid session');
      return false;
    }
    // Set type
    req.userType = req.session.user.type;
    next();
    return false;
  }

  // Initiate database
  var db = new Datastore({
    filename: 'conf/users.db',
    autoload: true
  });

  // Ensure index
  db.ensureIndex({
    fieldName: 'username',
    unique: true
  }, function (err) {
    if (err) {
      console.log(err);
    }
  });

  var checkCreds = function (username, password, cb) {
    db.find({
      username: username
    }, function (err, data) {
      if (err) {
        cb(false);
        return false;
      }
      // Check username
      if (!data.length) {
        cb(false);
        return false;
      }

      // Check data
      if (!passwordHash.verify(password, data[0].password)) {
        cb(false);
        return false;
      }

      // Set user type in the request object
      req.userType = data[0].type;
      cb(true);
      return true;

    });
  };

  // Grab the "Authorization" header.
  var auth = req.get('authorization');

  // On the first request, the "Authorization" header won't exist, so we'll set a Response
  // header that prompts the browser to ask for a username and password.
  if (!auth) {
    res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
    // If the user cancels the dialog, or enters the password wrong too many times,
    // show the Access Restricted error message.
    return res.status(401).send('Authorization Required');
  } else {
    // If the user enters a username and password, the browser re-requests the route
    // and includes a Base64 string of those credentials.
    var credentials = new Buffer(auth.split(' ').pop(), 'base64').toString('ascii').split(':');
    checkCreds(credentials[0], credentials[1], function (result) {
      if (result) {
        next();
      } else {
        res.status(403).send('Access Denied (incorrect credentials)');
      }
    });

  }
};

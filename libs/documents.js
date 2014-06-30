var fs = require('fs');
var config = require('./config');
var validate = require('./validate');

module.exports = function (req) {

  var self = this;
  var Conn;
  var base = __dirname + '/../conf/schemas/';
  var adapters = __dirname + '/../adapters/';

  // Ensure connection settings
  if (!config.service.hasOwnProperty('conn')) {
    self.respond(500, 'No document connection specified');
    return false;
  }

  // Ensure adapter
  if (!config.service.conn.hasOwnProperty('adapter') || !fs.existsSync(adapters + config.service.conn.adapter + '/main.js')) {
    self.respond(500, 'Missing connection adapter: ' + adapters + config.service.conn.adapter + '/main.js');
    return false;
  }

  // Load adapter
  Conn = require('./../adapters/' + config.service.conn.adapter + '/main.js');
  // Instantiate db instance
  var db = new Conn();

  // Get params
  var params = req.params[0].split('/');
  var version = params[1];
  var collection = params[2];
  var schema;
  var id = params[3] || false;
  var cursor = {};
  var search = {};
  var orderby = false;

  // Check for query
  if (Object.keys(req.query).length > 0) {
    // Check page property
    if (req.query.hasOwnProperty('page')) {
      // Set
      cursor.page = req.query.page;
    } else {
      // Default
      cursor.page = 1;
    }
    // Check count property
    if (req.query.hasOwnProperty('count')) {
      // Set
      cursor.count = req.query.count;
    } else {
      // Default
      cursor.count = 10;
    }
    // Check search
    if (req.query.hasOwnProperty('search')) {
      search = req.query.search;
    }
    // Check order
    if (req.query.hasOwnProperty('orderby')) {
      orderby = req.query.orderby;
    }
  }

  // Ensure version exists
  if (!fs.existsSync(base + version)) {
    self.respond(404, 'Version does not exist');
    return false;
  }

  // Ensure schema exists, load into memory
  if (!fs.existsSync(base + version + '/' + collection + '.json')) {
    self.respond(404, 'Schema does not exist');
    return false;
  } else {
    try {
      // Load into object
      schema = JSON.parse(fs.readFileSync(base + version + '/' + collection + '.json', 'utf8'));
    } catch (e) {
      // No dice
      self.respond(500, 'Error loading schema');
      return false;
    }
  }

  // Get single or multiple documents
  var read = function () {
    if (id) {
      // Find by ID
      db.find(collection, cursor, {
        _id: id
      }, function (err, data) {
        if (err) {
          self.respond(500, err);
          return false;
        }
        // Data?
        if (!Object.keys(data).length) {
          self.respond(404);
          return false;
        }
        // Yup!
        self.respond(200, data);
      });
    } else {
      // Find multiple
      db.find(collection, cursor, search, orderby, function (err, data) {
        if (err) {
          self.respond(500, err);
        }
        // Data?
        if (!Object.keys(data).length) {
          // Endpoint exists, but no data...
          self.respond(200, {});
          return false;
        }
        // Yup!
        self.respond(200, data);
      });
    }
  };

  // Create a document
  var create = function () {
    // Validate against scheam
    validate('create', req.body, schema, function (err) {
      if (err) {
        self.respond(400, err);
        return false;
      }
      // Passed, run insert
      db.insert(collection, req.body, function (err, data) {
        if (err) {
          self.respond(500, err);
          return false;
        }
        // All good
        self.respond(201, data);
      });
    });
  };

  // Update a document
  var update = function () {
    // Validate against scheam
    validate('update', req.body, schema, function (err) {
      if (err) {
        self.respond(400, err);
        return false;
      }
      // Passed, run insert
      db.update(collection, {
        _id: id
      }, req.body, function (err, data) {
        if (err) {
          self.respond(500, err);
          return false;
        }
        // All good
        self.respond(200, data);
      });
    });
  };

  // Delete a document
  var del = function () {
    db.remove(collection, {
      _id: id
    }, function (err) {
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

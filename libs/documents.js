var fs = require('fs');
var config = require('./config');
var validate = require('./validate');

module.exports = function (req, res) {

  var self = this;
  var Conn;
  var base = __dirname + '/../conf/schemas/';
  var adapters = __dirname + '/../adapters/documents/';

  // Ensure connection settings
  if (!config.service.hasOwnProperty('documents')) {
    self.respond(500, 'No document connection specified');
    return false;
  }

  // Ensure adapter
  if (!config.service.documents.hasOwnProperty('adapter') || !fs.existsSync(adapters + config.service.documents.adapter + '/main.js')) {
    self.respond(500, 'Missing connection adapter: ' + adapters + config.service.documents.adapter + '/main.js');
    return false;
  }

  // Load adapter
  Conn = require('./../adapters/documents/' + config.service.documents.adapter + '/main.js');
  // Instantiate db instance
  var db = new Conn();

  // Get params
  var params = req.params[0].split('/');
  var version = params[1];
  var collection = params[2];
  var schema;
  var id = params[3] || false;
  var cursor = {
    page: 1,
    count: 50
  };
  var search = {};
  var orderby = false;

  // Check for query
  if (Object.keys(req.query).length > 0) {
    // Check page property
    if (req.query.hasOwnProperty('page')) {
      // Set
      cursor.page = req.query.page;
    }
    // Check count property
    if (req.query.hasOwnProperty('count')) {
      // Set
      cursor.count = req.query.count;
    }
    // Check search
    if (req.query.hasOwnProperty('search')) {
      try {
        search = JSON.parse(req.query.search);
      } catch (e) {
        self.respond(400, 'Invalid search query format');
        return false;
      }
      var operators = ['$ne', '$lt', '$lte', '$gt', '$gte'];
      // Verify comparison operators
      for (var q in search) {
        if (typeof search[q] === 'object') {
          if (operators.indexOf(Object.keys(search[q])[0]) === -1) {
            self.respond(400, 'Invalid query operator');
            return false;
          }
        }
      }
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
          self.respond(err.code, err.message);
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
          self.respond(err.code, err.message);
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
          self.respond(err.code, err.message);
          return false;
        }
        // All good
        res.header('Location', self.uri + data[0]._id);
        self.respond(201, data[0]);
      });
    });
  };

  // Update a document
  var update = function () {
    // Determine query
    var query;
    if (id) {
      // Single record update
      query = {
        _id: id
      };
    } else if (search !== {}) {
      query = search;
    } else {
      // Not valid
      self.respond(400, 'Invalid query');
    }
    // Validate against scheam
    validate('update', req.body, schema, function (err) {
      if (err) {
        self.respond(400, err);
        return false;
      }
      // Passed, run insert
      db.update(collection, query, req.body, function (err, data) {
        if (err) {
          self.respond(err.code, err.message);
          return false;
        }
        // All good
        self.respond(200, data);
      });
    });
  };

  // Delete a document
  var del = function () {
    // Determine query
    var query;
    if (id) {
      // Single record update
      query = {
        _id: id
      };
    } else if (search !== {}) {
      query = search;
    } else {
      // Not valid
      self.respond(400, 'Invalid query');
    }
    db.remove(collection, query, function (err) {
      if (err) {
        self.respond(err.code, err.message);
        return false;
      }
      // Success
      self.respond(204);
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

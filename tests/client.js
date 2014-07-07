var restify = require('restify');
var config = require('./../libs/config');

module.exports = {

  // Run test
  test: function (request, cb) {

    var client = restify.createJsonClient({
      url: 'http://localhost:' + config.service.port,
      version: '*'
    });

    // BasicAuth
    client.basicAuth('admin', 'password123');
    // Request
    switch (request.specs.method) {
    case 'GET':
      client.get(request.specs.url, function (err, req, res, data) {
        cb(res, data);
      });
      break;
    case 'POST':
      client.post(request.specs.url, request.specs.payload, function (err, req, res, data) {
        cb(res, data);
      });
      break;
    case 'PUT':
      client.put(request.specs.url, request.specs.payload, function (err, req, res, data) {
        cb(res, data);
      });
      break;
    case 'DELETE':
      client.del(request.specs.url, function (err, req, res) {
        cb(res, false);
      });
      break;
    default:
      cb(500, 'Invalid test request');
    }
  }

};

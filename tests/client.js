var restify = require('restify');
var config = require('./../libs/config');

module.exports = {

  // JSON Client
  client: restify.createJsonClient({
    url: 'http://localhost:' + config.service.port,
    version: '*'
  }),

  // Run test
  test: function (request, cb) {
    // BasicAuth
    this.client.basicAuth('admin', 'password123');
    // Request
    switch (request.specs.method) {
    case 'GET':
      this.client.get(request.url, function (err, req, res, data) {
        cb(res.statusCode, data);
      });
      break;
    case 'POST':
      this.client.post(request.url, request.specs.payload, function (err, req, res, data) {
        cb(res.statusCode, data);
      });
      break;
    case 'PUT':
      this.client.put(request.url, request.specs.payload, function (err, req, res, data) {
        cb(res.statusCode, data);
      });
      break;
    case 'DELETE':
      this.client.del(request.url, function (err, req, res) {
        cb(res.statusCode, false);
      });
      break;
    default:
      cb(500, 'Invalid test request');
    }
  }

};

var restify = require('restify');
var config = require('./../libs/config');

module.exports = {

  // JSON Client
  jsonClient: restify.createJsonClient({
    url: 'http://localhost:' + config.service.port,
    version: '*'
  }),

  // Run test
  test: function () {

  }

};

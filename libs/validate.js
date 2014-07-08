/* jshint eqeqeq: false */
var config = require('./config');
// type = create or update
module.exports = function (type, data, schema, cb) {

  // Store key-value type validation failures
  var failures = {};

  // Type conversion
  var toType = function (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };

  // Ensure single entity
  if (toType(data) === 'array') {
    cb('Only accepts single object');
    return false;
  }

  // Loop through schema
  for (var prop in schema) {
    // Check required
    if (schema[prop].hasOwnProperty('required') && schema[prop].required && type === 'create') {
      if (!data.hasOwnProperty(prop)) {
        failures[prop] = 'required';
      }
    }

    // Set json -> object
    if (schema[prop].hasOwnProperty('type') && schema[prop].type === 'json') {
      schema[prop].type = 'object';
    }

    // Validate types
    if (schema[prop].hasOwnProperty('type') && data.hasOwnProperty(prop)) {
      if (toType(data[prop]) !== schema[prop].type) {
        failures[prop] = 'Type failure: ' + schema[prop].type;
      }
    }
  }

  // Check strict schemas
  if (config.service.schemas.strict) {
    for (var key in data) {
      if (Object.keys(schema).indexOf(key) === -1) {
        // Not in schema
        failures[key] = 'Invalid key, not in schema';
      }
    }
  }

  // Set err to failures or false
  var err = (Object.keys(failures).length > 0) ? failures : err;

  // Fire callback
  cb(err);

};

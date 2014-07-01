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

  // Loop through schema
  for (var prop in schema) {
    // Check required
    if (schema[prop].hasOwnProperty('required') && schema[prop].required && type === 'create') {
      if (!data.hasOwnProperty(prop)) {
        failures[prop] = 'required';
        return false;
      }
    }

    // Validate types
    if (schema[prop].hasOwnProperty('type') && data.hasOwnProperty(prop)) {
      switch (schema[prop].type) {
      case 'string':
        if (toType(data[prop]) !== 'string') {
          failures[prop] = 'Type failure: string';
        }
        break;
      case 'number':
        if (!/^\d+$/.test(data[prop])) {
          failures[prop] = 'Type failure: number';
        }
        break;
      case 'boolean':
        if (data[prop] != 'true' || data[prop] != 'false') {
          failures[prop] = 'Type failure: boolean';
        }
        break;
      case 'array':
        if (toType(data[prop]) !== 'array') {
          failures[prop] = 'Type failure: array';
        }
        break;
      case 'json':
        try {
          JSON.parse(data[prop]);
        } catch (e) {
          failures[prop] = 'Type failure: json';
        }
        break;
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
  var err = (Object.keys(failures).length > 0) ? failures : false;

  // Fire callback
  cb(err);

};

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
    if (schema[prop].hasOwnProperty('required') && schema[prop].required && type === 'insert') {
      if (!data.hasOwnProperty(prop)) {
        failures[prop] = 'required';
        return false;
      }
    }
    
    // Validate types
    if (schema[prop].hasOwnProperty('type')) {
      switch (schema[prop].type) {
        case 'string':
          if (toType(data[prop]) !== 'string') {
            failures[prop] = 'Type failure: string';
          }
          break;
        case 'number':
          if (toType(data[prop]) !== 'number') {
            failures[prop] = 'Type failure: number';
          }
          break;
        case 'boolean':
          if (toType(data[prop]) !== 'boolean') {
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
  
  // Set err to failures or false
  var err = (Object.keys(failures).length > 0) ? failures : false;
  
  // Fire callback
  cb(err);
  
};
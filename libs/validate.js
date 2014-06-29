// type = create or update
module.exports = function (type, data, schema, cb) {
  
  // Store key-value type validation failures
  var failures = {};
  
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
          
          break;
        case 'number':
          
          break;
        case 'boolean':
          
          break;
        case 'array':
          
          break;
        case 'json':
          
          break;
      }
    }
  }
  
  // Set err to failures or false
  var err = (Object.keys(failures).length > 0) ? failures : false;
  
  // Fire callback
  cb(err);
  
};
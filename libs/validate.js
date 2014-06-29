// type = create or update
module.exports = function (type, data, schema, cb) {
  
  // Loop through schema
  for (var prop in schema) {
    // Check required
    if (schema[prop].hasOwnProperty('required') && schema[prop].required && type === 'insert') {
      if (!data.hasOwnProperty(prop)) {
        cb(prop+' is required');
        return false;
      }
    }
  }
  
};
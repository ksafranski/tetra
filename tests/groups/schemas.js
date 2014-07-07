// Test schema
var testDoc = {
  name: {
    type: 'string',
    required: true
  },
  active: {
    type: 'boolean'
  },
  list: {
    type: 'array'
  },
  info: {
    type: 'json'
  }
};

module.exports = {
  // Create new version
  CreateVersion: {
    method: 'POST',
    url: '/version',
    payload: {
      name: 'vTEST'
    },
    resultCode: 201,
    result: false
  },
  // Create new schema
  Create: {
    method: 'POST',
    url: '/schema/vTEST',
    payload: {
      name: 'test',
      document: testDoc
    },
    resultCode: 201,
    result: false
  },
  // Test read
  Read: {
    method: 'GET',
    url: '/schema/vTEST/test',
    payload: false,
    resultCode: 200,
    result: testDoc
  },
  // Test Update
  Update: {
    method: 'PUT',
    url: '/schema/vTEST/test',
    payload: {
      name: {
        type: 'number'
      }
    },
    resultCode: 200,
    result: false
  },
  // Test Delete
  Delete: {
    method: 'DELETE',
    url: '/schema/vTEST/test',
    payload: false,
    resultCode: 204,
    result: false
  },
  // Delete version
  DeleteVersion: {
    method: 'DELETE',
    url: '/version/vTEST',
    payload: false,
    resultCode: 204,
    result: false
  }
};

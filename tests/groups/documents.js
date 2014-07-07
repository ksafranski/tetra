// Test schema
var testSchema = {
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

// Test doc
var testDoc = {
  name: 'John Doe',
  active: true,
  list: ['a', 'b', 'c'],
  info: {
    foo: 'bar'
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
  CreateSchema: {
    method: 'POST',
    url: '/schema/vTEST',
    payload: {
      name: 'test',
      document: testSchema
    },
    resultCode: 201,
    result: false
  },
  // Test create
  Create: {
    method: 'POST',
    url: '/document/vTEST/test',
    payload: testDoc,
    resultCode: 201,
    result: testDoc
  },
  // Test read
  ReadAll: {
    method: 'GET',
    url: '/document/vTEST/test',
    payload: false,
    resultCode: 200,
    result: false
  },
  // Test read query
  ReadQuery: {
    method: 'GET',
    url: '/document/vTEST/test?search={"name":"John Doe"}',
    payload: false,
    resultCode: 200,
    result: testDoc
  },
  // Test Update
  Update: {
    method: 'PUT',
    url: '/document/vTEST/test?search={"name":"John Doe"}',
    payload: {
      active: false
    },
    resultCode: 200,
    result: false
  },
  // Test Delete
  Delete: {
    method: 'DELETE',
    url: '/document/vTEST/test?search={"name":"John Doe"}',
    payload: false,
    resultCode: 204,
    result: false
  },
  // Delete schema
  DeleteSchema: {
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

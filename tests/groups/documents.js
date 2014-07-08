var data = require('./../data.json');
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
      document: data.schema
    },
    resultCode: 201,
    result: false
  },
  // Test create
  Create: {
    method: 'POST',
    url: '/document/vTEST/test',
    payload: data.document,
    resultCode: 201,
    result: data.document
  },
  // Test read
  ReadAll: {
    method: 'GET',
    url: '/document/vTEST/test?search=' + encodeURIComponent('{"name":"John Doe"}'),
    payload: false,
    resultCode: 200,
    result: false
  },
  // Test read query
  ReadQuery: {
    method: 'GET',
    url: '/document/vTEST/test?search=' + encodeURIComponent('{"name":"John Doe"}'),
    payload: false,
    resultCode: 200,
    result: data.document
  },
  // Test Update
  Update: {
    method: 'PUT',
    url: '/document/vTEST/test?search=' + encodeURIComponent('{"name":"John Doe"}'),
    payload: {
      active: false
    },
    resultCode: 200,
    result: false
  },
  // Test Delete
  Delete: {
    method: 'DELETE',
    url: '/document/vTEST/test?search=' + encodeURIComponent('{"name":"John Doe"}'),
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

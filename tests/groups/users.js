module.exports = {
  // Create new user
  Create: {
    method: 'POST',
    url: '/user',
    payload: {
      username: 'testuser',
      password: 'testpassword',
      type: 1
    },
    resultCode: 201,
    result: false
  },
  // Test read
  Read: {
    method: 'GET',
    url: '/user/testuser',
    payload: false,
    resultCode: 200,
    result: {}
  },
  // Test Update
  Update: {
    method: 'PUT',
    url: '/user/testuser',
    payload: {
      username: 'testuserchanged'
    },
    resultCode: 204,
    result: false
  },
  // Test Delete
  Delete: {
    method: 'DELETE',
    url: '/user/testuserchanged',
    payload: false,
    resultCode: 204,
    result: false
  }
};

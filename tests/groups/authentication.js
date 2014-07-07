module.exports = {
  // Test BasicAuth authentication
  BasicAuth: {
    method: 'GET',
    url: '/user',
    payload: false,
    resultCode: 200,
    result: false
  },
  Session: {
    method: 'POST',
    url: '/session',
    payload: {
      username: 'admin',
      password: 'password123'
    },
    resultCode: 201,
    result: false
  }
};

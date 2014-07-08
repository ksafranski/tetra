var data = require('./../data.json');
module.exports = {
  // Test BasicAuth authentication
  BasicAuth: {
    method: 'GET',
    url: '/user',
    payload: false,
    resultCode: 200,
    result: false
  },
  // Test session authentication
  Session: {
    method: 'POST',
    url: '/session',
    payload: {
      username: data.authentication.username,
      password: data.authentication.password
    },
    resultCode: 201,
    result: false
  }
};

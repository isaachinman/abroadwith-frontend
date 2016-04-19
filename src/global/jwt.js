const jwt_decode = require('jwt-decode');

module.exports = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

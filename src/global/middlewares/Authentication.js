var jwt = require('jsonwebtoken');
var fs = require('fs');

var public_key = "-----BEGIN PUBLIC KEY-----\n"+
"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwiFPc0o+YUiBbrXkF7SA"+
"d7zshZJf2sCvnEy+CTrn5xcJDnbV8x94bxbWari9B3O2cZmcXyNAVBvfsiDXzheJ"+
"8vX1uotXNiGi3a9yyUCo7Ga8g3QljjMjwHgbUAsIO1tjZL9shSS8qoummqi+c57b"+
"1nWkpbP8S2eR9Qf2ZVLklIm8alH6IeR1j07Tt9mnUBPG+ivhnmkLHENFYUPjuO4p"+
"DsRVHGAaXusDDU89R6KGO7UdVOn9GWdTsem27lbCrVE+RqPnTq1WfwalOApwZYeH"+
"B06Jsi/4FQp+8N3GG3RlzF1boEaN4xzBLzgQ7ll2TlkCWaBpZitqi6gK/aaHrOd7"+
"IwIDAQAB\n"+
"-----END PUBLIC KEY-----"

module.exports = function (req, res, next) {
    var token, error;

    if (req.query && req.query['access_token']) {
      token = req.query['access_token'];
    }

    if (req.body && req.body['access_token']) {
      if (token) {
        error = true;
      }
      token = req.body['access_token'];
    }

    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        if (token) {
          error = true;
        }
        token = parts[1];
      }
    }

    // RFC6750 states the access_token MUST NOT be provided in more than one place in a single request.
    if (error) {
      res.sendStatus(400);
    }
    else{
      if(!token) {
        next();
        return;
      }

      var decoded = jwt.verify(token, new Buffer(public_key,'utf8'), { algorithms: ['RS512'] }, function (err, payload) {
        if(!err){
          req.user = {};
          req.user.name = payload.name;
          req.user.email = payload.email;
          console.log(req.user);
          next();
          return;
        }
        else{
          console.log("Error: "+ err + ", while processing token: "+token);
          next();
          return;
        }
      });
    }
};

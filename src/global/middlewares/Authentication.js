var jwt = require('jsonwebtoken');
var fs = require('fs');
var ServerSettings = require('../../ServerSettings');
var winston = require('winston');

module.exports = function (req, res, next) {
    var token;

    if(req.query && req.query.has_logged_out){
      res.cookie('access_token',"null", { secure:true, httpOnly: true, expires:new Date(0), domain:ServerSettings.cookieDomain });
      next();
      return;
    }

    if(req.cookies && req.cookies['access_token']){
      token = req.cookies['access_token'];
    }

    if(!token) {
      next();
      return;
    }



    var decoded = jwt.verify(token, new Buffer(ServerSettings.public_key,'utf8'), { algorithms: ['RS512'] }, function (err, payload) {
      if(!err){
        req.logged_user = {};
        req.logged_user.name = payload.name;
        req.logged_user.email = payload.email;
        req.logged_user.id = payload.rid;
        next();
        return;
      }
      else{
        winston.error("[ERROR]",err);
        next();
        return;
      }
    });
};

var express = require('express');
var nunjucks = require('nunjucks');
var https = require('https');

var routerPost = express.Router();
var routerGet = express.Router();

var lwip = require('lwip');

var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage, limits:{fileSize:100000000} });

var AWS = require('aws-sdk');

var s3 = new AWS.S3({
  region:'eu-central-1',
  accessKeyId: 'AKIAJHQLS5YYTJABTUJQ',
  secretAccessKey: '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'
});

var uploadImage = function(image_file,image_key,options,callback){
  var type;

  switch(image_file.mimetype){
    case 'image/jpg':
    case 'image/jpeg':
    case 'image/pjpeg': type = 'jpg'; break;
    case 'image/png': type = 'png'; break;
    default:
      console.log("Error! Not supported image type:",image_file);
      if(callback) callback("Not supported image type.");
      return;
  }

  var width = options ? options.width : 1400;
  var height = options ? options.height : null;
  var crop_width = options ? options.crop ? options.crop.width : width : width;
  var crop_height = 0;

  lwip.open(image_file.buffer,type,function(err, image){
    if(!height){
      height = image.height()*(width/image.width());
      crop_height = options ? options.crop ? options.crop.height : height : height;
    }
    image.batch()
      .resize(width,height)
      .crop(crop_width,crop_height)
      .toBuffer('jpg',{quality:90}, function(err,buffer){
        if(err){
          console.log(err);
          if(callback) callback(err);
        }
        else{
          var params = {ACL: 'public-read',
                        Bucket: 'img.abroadwith.com',
                        Key: image_key,
                        Body: buffer,
                        ContentType: image_file.mimetype};
          s3.putObject(params, function(err, data) {
              if(err) console.log(err);
              if(callback) callback(err);
           });
        }
      });
  });
}

var newSquarePhoto = function(file, key, callback){
  uploadImage(file,key,{width:250,crop:{width:250,height:250}},callback);
}

var newHeroPhoto = function(file, key, callback){
  uploadImage(file,key,{width:1400},callback);
}

routerGet.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No text context.');
  res.send(nunjucks.render('upload/upload.html',req.context));
});

var postSingle = function(req,path,photo,callback){
  var post_data = JSON.stringify({pathName:photo});

  var post_options = {
      host: 'admin.abroadwith.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + req.token,
          'Content-Length': Buffer.byteLength(post_data),
          'Content-Type': "application/json"
      }
  };

  // Set up the request
  var post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8');
  });

  post_req.on('error', function (e) {
    callback(e);
  });
  // post the data
  post_req.write(post_data);
  post_req.end();
  callback();
}

var postMultiple = function(req,path,photos,callback){
  var data = {images:[]};
  var i = photos.length;
  while(--i >= 0){
    data.images.push({pathName:photos[i]});
  }
  var post_data = JSON.stringify(data);

  var post_options = {
      host: 'admin.abroadwith.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + req.token,
          'Content-Length': Buffer.byteLength(post_data),
          'Content-Type': "application/json"
      }
  };

  // Set up the request
  var post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8');
  });

  post_req.on('error', function (e) {
    callback(e);
  });
  // post the data
  console.log("Posting ",post_data);
  post_req.write(post_data);
  post_req.end();
  callback();
}

var routerUser = express.Router();
routerUser.post('/', function (req, res) {
  if(!req.decoded_token || req.decoded_token.id != req.photoUserId){
    res.status(401).send('Restricted function.');
    return;
  }
  if(req.files.length > 1){
    res.status(400).send('Multiple files are not accepted.');
    return;
  }
  if(req.files.length < 1){
    res.status(400).send('One file is required.');
    return;
  }
  var imagePath = '/users/'+req.photoUserId+'/'+(new Date().getTime())+".jpg";
  newSquarePhoto(req.files[0],imagePath.substring(1),function(err){
    var result = {};
    if(err){
      result[req.files[0].originalname] = {
        status:"ERROR",
        message: err.toString()
      }
      res.end(JSON.stringify(result));
    }
    else{
      postSingle(req,"/users/"+req.photoUserId+"/photo",imagePath,function(err){
        if(!err){
          result[req.files[0].originalname] = {
            status:"OK",
            location: imagePath
          }
        }
        else{
          result[req.files[0].originalname] = {
            status:"ERROR",
            message: err.toString()
          }
        }
        res.end(JSON.stringify(result));
      });
    }
  });
});

var routerRoom = express.Router();
routerRoom.post('/', function (req, res) {
  if(!req.decoded_token || req.decoded_token.id != req.photoUserId){
    res.status(401).send('Restricted function.');
    return;
  }
  if(req.files.length > 1){
    res.status(400).send('Multiple files are not accepted.');
    return;
  }
  if(req.files.length < 1){
    res.status(400).send('One file is required.');
    return;
  }
  var imagePath = "/users/"+req.photoUserId+"/homes/"+req.photoHomeId+"/rooms/"+req.photoRoomId+"/"+(new Date().getTime())+".jpg";
  newHeroPhoto(req.files[0],imagePath.substring(1),function(err){
    var result = {};
    if(err){
      result[req.files[0].originalname] = {
        status:"ERROR",
        message: err.toString()
      }
      res.end(JSON.stringify(result));
    }
    else{
      postSingle(req,"/users/"+req.photoUserId+"/homes/"+req.photoHomeId+"/rooms/"+req.photoRoomId+"/photo",imagePath,function(err){
        if(!err){
          result[req.files[0].originalname] = {
            status:"OK",
            location: imagePath
          }
        }
        else{
          result[req.files[0].originalname] = {
            status:"ERROR",
            message: err.toString()
          }
        }
        res.end(JSON.stringify(result));
      });
    }
  });
});

var helper = function(req,res,file){
  console.log(file.imagePath);
  newHeroPhoto(file,file.imagePath.substring(1),function(err){
    if(err){
      req.result[file.originalname] = {
        status:"ERROR",
        message: err.toString()
      }
    }
    else{
      req.result[file.originalname] = {
        status:"OK",
        location: file.imagePath
      }
      req.successful.push(file.imagePath);
    }
    if(++req.done >= req.files.length){
      //Done uploading
      postMultiple(req,"/users/"+req.photoUserId+"/homes/"+req.photoHomeId+"/photos",req.successful,function(err){
        if(err){
          res.status(500).send('Problem updating API.');
        }
        else{
          res.end(JSON.stringify(req.result));
        }
      });
    }
  });
}

var routerHome = express.Router();
routerHome.post('/', function (req, res) {
  if(!req.decoded_token || req.decoded_token.id != req.photoUserId){
    res.status(401).send('Restricted function.');
    return;
  }
  var i = req.files.length;
  req.done = 0;
  req.successful = [];
  req.result = {};
  while(--i >= 0){
    req.files[i].imagePath = "/users/"+req.photoUserId+"/homes/"+req.photoHomeId+"/"+(new Date().getTime())+"_"+i+".jpg";
    helper(req,res,req.files[i]);
  }
});

var userIdHandler = require('./PhotoUserIdHandler');
var homeIdHandler = require('./PhotoHomeIdHandler');
var roomIdHandler = require('./PhotoRoomIdHandler');
var headerTokenHandler = require('./HeaderTokenHandler');

var installer = function(app) {
  app.param('photoUserId',userIdHandler);
  app.param('photoHomeId',homeIdHandler);
  app.param('photoRoomId',roomIdHandler);
  app.use(headerTokenHandler);
  app.use('/upload/users/:photoUserId/photo',upload.array('photos', 10));
  app.use('/upload/users/:photoUserId/photo',routerUser);

  app.use('/upload/users/:photoUserId/homes/:photoHomeId/photos',upload.array('photos', 10));
  app.use('/upload/users/:photoUserId/homes/:photoHomeId/photos',routerHome);

  app.use('/upload/users/:photoUserId/homes/:photoHomeId/rooms/:photoRoomId/photo',upload.array('photos', 10));
  app.use('/upload/users/:photoUserId/homes/:photoHomeId/rooms/:photoRoomId/photo',routerRoom);
  //app.use('/upload/user/home/:homePhotoId/rooms/:roomPhotoId/photo',upload.single('photo'));
  //app.use('/upload/user/home/:homePhotoId/photo',upload.array('photos', 10));
  //app.use('/upload',routerPost);
  app.use('/upload',routerGet);
};

module.exports = installer;
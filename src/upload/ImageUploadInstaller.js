var express = require('express');
var nunjucks = require('nunjucks');

var routerPost = express.Router();
var routerGet = express.Router();

var lwip = require('lwip');

var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage, limits:{fileSize:1} });

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

var newProfilePhoto = function(file, key, callback){
  uploadImage(file,key,{width:250,crop:{width:250,height:250}},callback);
}

routerPost.post('/', function (req, res) {
  if(req.files.length > 1){
    res.status(400).send('Multiple files are not accepted.');
    return;
  }
  if(req.files.length < 1){
    res.status(400).send('One file is required.');
    return;
  }
  var result = {};
  newProfilePhoto(req.files[0],'users/3.jpg',function(err){
    if(err){
      result[req.files[0].originalname] = {
        status:"ERROR",
        message: err.toString()
      }
    }
    else{
      result[req.files[0].originalname] = {
        status:"OK",
        location: 'users/3.jpg'
      }
    }
    res.end(JSON.stringify(result));
  });
});

routerGet.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No text context.');
  res.send(nunjucks.render('test/test.html',req.context));
});

var userIdHandler = require('./PhotoUserIdHandler');
var homeIdHandler = require('./PhotoHomeIdHandler');

var installer = function(app) {
  app.param('userId',userIdHandler);
  app.param('userId',homeIdHandler);
  app.use('/upload/user/photo',upload.single('photo'));
  app.use('/upload/user/home/:homePhotoId/rooms/:roomPhotoId/photo',upload.single('photo'));
  app.use('/upload/user/home/:homePhotoId/photo',upload.array('photos', 10));
  app.use('/upload',routerPost);
  app.use('/upload',routerGet);
};

module.exports = installer;

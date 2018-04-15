/* eslint-disable */

var express = require('express');
var http = require('http');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var fs = require('fs');

var languages = {};

var loadLanguage = function(language){
    var util  = require('util'),
        spawn = require('child_process').spawn,
        ls    = spawn('ls', [language]);

    ls.stdout.on('data', function (data) {
      files = data.toString().split('.json\n');
      languages[language] = {};
      for(var i = 0; i < files.length; i++){
        if(files[i].length > 1){
          languages[language][files[i]] = JSON.parse(fs.readFileSync('./'+language+'/'+files[i]+'.json', 'utf8').toString()); //THIS SOOOO DOESN'T WORK with concurrency
        }
      }
    });
}

var loadAllLanguages = function(){
  languages = {};
  loadLanguage('es');
  loadLanguage('de');
  loadLanguage('en');
  // loadLanguage('pt');
  // loadLanguage('fr');
  // loadLanguage('it');
}

loadAllLanguages();

var app = express();

app.use(bodyParser.json({limit: '50mb'}))

nunjucks.configure('src',
  {
    watch:true,
    tags: {
      blockStart: '<%',
      blockEnd: '%>',
      variableStart: '<$',
      variableEnd: '$>',
      commentStart: '<#',
      commentEnd: '#>'
    }
  }
);

var router = express.Router();

var writeLanguages = function(body){
  for(var language in body){
    for(var context in body[language]){
      if(!languages[language][context]){
        languages[language][context] = {};
      }
      else{
        languages[language][context] = JSON.parse(fs.readFileSync('./'+language+'/'+context+'.json', 'utf8').toString());
      }
      for(var item in body[language][context]){
        if(body[language][context][item] && body[language][context][item].length > 0){
          languages[language][context][item] = body[language][context][item];
        }
        else if (body[language][context][item] && body[language][context][item] != ""){
          languages[language][context][item] = body[language][context][item];
        }
      }
      var content = JSON.stringify(languages[language][context],null,2);
      fs.writeFile(language+"/"+context+".json", content , function(err) {
          if(err) {
            console.log(err)
          }
      });
    }
  }
}

router.post('/', function (req, res) {
  var result = "Nothing happened.";
  var spawn = require('child_process').spawn,
      pull    = spawn('git', ['pull','origin','master']);

  pull.stderr.on('data', function (data) {
    result = "Error on pull:\n"+data;
  });

  pull.stdout.on('data', function (data) {
    result = "Pull request:\n"+data;
  });

  pull.on('exit', function (code) {
    if(code != 0){
      res.send(result);
    }
    else{
      writeLanguages(req.body);
      var spawn = require('child_process').spawn,
          add    = spawn('git', ['add','.']);

      add.stderr.on('data', function (data) {
        result += "\nError on add:\n"+data;
      });

      add.stdout.on('data', function (data) {
        result += "\nAdd request:\n"+data;
      });

      add.on('exit', function (code) {
        if(code != 0){
          res.send(result);
        }
        else{
          var spawn = require('child_process').spawn,
              commit    = spawn('git', ['commit','-am "Saving new translations."']);
          commit.stderr.on('data', function (data) {
            result += "\nError on commit:\n"+data;
          });

          commit.stdout.on('data', function (data) {
            result += "\nCommit request:\n"+data;
          });

          commit.on('exit', function (code) {
            if(code != 0){
              res.send(result);
            }
            else{
              var spawn = require('child_process').spawn,
                  push    = spawn('git', ['push','origin','master']);
              push.stderr.on('data', function (data) {
                result += "\n"+data;
              });

              push.stdout.on('data', function (data) {
                result += "\n"+data;
              });

              push.on('exit', function (code) {
                loadAllLanguages();
                res.send(result);
              });
            }
          });
        }
      });
    }
  });
});

router.get('/en', function (req, res) {
  var context = {};
  context.name = "English";
  context.language = 'en';
  context.string = JSON.stringify({en:languages['en']});
  context.languages = languages;
  console.log("Translations are being used: "+new Date(),req.headers);
  res.send(nunjucks.render('main.html',context));
});

router.get('/pt', function (req, res) {
  var context = {};
  context.name = "Portuguese";
  context.language = 'pt';
  context.string = JSON.stringify({pt:languages['pt']});
  context.languages = languages;
  console.log("Translations are being used: "+new Date(),req.headers);
  res.send(nunjucks.render('main.html',context));
});

router.get('/es', function (req, res) {
  var context = {};
  context.name = "Spanish";
  context.language = 'es';
  context.string = JSON.stringify({es:languages['es']});
  context.languages = languages;
  console.log("Translations are being used: "+new Date(),req.headers);
  res.send(nunjucks.render('main.html',context));
});

router.get('/de', function (req, res) {
  var context = {};
  context.name = "German";
  context.language = 'de';
  context.string = JSON.stringify({de:languages['de']});
  context.languages = languages;
  console.log("Translations are being used: "+new Date(),req.headers);
  res.send(nunjucks.render('main.html',context));
});

router.get('/it', function (req, res) {
  var context = {};
  context.name = "Italian";
  context.language = 'it';
  context.string = JSON.stringify({it:languages['it']});
  context.languages = languages;
  console.log("Translations are being used: "+new Date(),req.headers);
  res.send(nunjucks.render('main.html',context));
});

router.get('/fr', function (req, res) {
  var context = {};
  context.name = "French";
  context.language = 'fr';
  context.string = JSON.stringify({fr:languages['fr']});
  context.languages = languages;
  console.log("Translations are being used: "+new Date(),req.headers);
  res.send(nunjucks.render('main.html',context));
});

router.get('/', function (req, res) {
  console.log("Translations are being used: "+new Date(),req.headers);
  res.send(nunjucks.render('all.html'));
});

app.use('/',router);

app.post('/shutdown',function (req, res, next) {
    function gracefulShutdown() {
      //res.removeListener('close', afterRequest);
      res.removeListener('finish', gracefulShutdown);
      console.log("Received kill signal, shutting down gracefully.");
      server.close(function() {
        console.log("Closed out remaining connections.");
        process.exit()
      });

      setTimeout(function() {
           console.error("Could not close connections in time, forcefully shutting down.");
           process.exit()
      }, 10*1000);
    }

    if(req.headers.authorization === "Basic NmQwODgwMjM6ODRjZjA1ZGFmNTZhNGZmNWFlZmRkYzhlMWQwMDE3YTA="){
      res.on('finish', gracefulShutdown);
      res.sendStatus(200);
    }
    else{
      res.sendStatus(403)
    }
});

console.log("Listening at port 4000");
http.createServer(app).listen(4000);

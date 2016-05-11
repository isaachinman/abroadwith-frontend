// This is the nunjucks translation setup file

var languages = require('../constants/UILanguages.json');
var fs = require('fs');

var translations = {};

var loadLanguage = function(language){
    var util  = require('util'),
        spawn = require('child_process').spawn,
        ls    = spawn('ls', ['locales/'+language]);

    ls.stdout.on('data', function (data) {
      files = data.toString().split('.json\n');
      translations[language] = {};
      for(var i = 0; i < files.length; i++){
        if(files[i].length > 1){
          translations[language][files[i]] = JSON.parse(fs.readFileSync('./locales/'+language+'/'+files[i]+'.json', 'utf8').toString());
        }
      }
    });
}

var loadAllLanguages = function(){
  translations = {};
  loadLanguage('es');
  loadLanguage('de');
  loadLanguage('en');
}

loadAllLanguages();

module.exports = translations;

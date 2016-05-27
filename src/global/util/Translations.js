// This is the nunjucks translation setup file
const languages = require('../constants/UILanguages.json')
const fs = require('fs')

var translations = {}

// Function to re-assemble translation json
var loadLanguage = function(language){

  var util = require('util')
  var spawn = require('child_process').spawn
  var ls = spawn('ls', ['locales/'+language])

  ls.stdout.on('data', function (data) {
    files = data.toString().split('.json\n')
    translations[language] = {}

    for (var i=0; i <files.length; i++) {
      if (files[i].length > 1) {
        translations[language][files[i]] = JSON.parse(fs.readFileSync('./locales/'+language+'/'+files[i]+'.json', 'utf8').toString())
      }
    }

  })
}

// Load all UI languages
for (obj in languages) {
  loadLanguage(obj)
}

module.exports = translations

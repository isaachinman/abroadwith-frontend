/* eslint-disable */

// This is the translation setup file

// All that it does is move translations from the locales
// repo into the build dir to be used by the application from there

// Additionally, it compiles all namespaces of a language into a single
// nested JSON file

var languages = require('../src/data/constants/UILanguages.json')

var path = require('path')
var fs = require('fs')

var rootDir = path.resolve(__dirname, '..')
var translations = {}

// Function to re-assemble translation json
var loadLanguage = function(language) {

  var util = require('util')
  var spawn = require('child_process').spawn
  var ls = spawn('ls', ['locales/' + language])

  ls.stdout.on('data', function (data) {
    var files = data.toString().split('.json\n')
    translations[language] = {}

    for (var i = 0; i < files.length; i++) {
      if (files[i].length > 1) {

        // Assemble each namespace into a nested object
        translations[language][files[i]] = JSON.parse(fs.readFileSync('./locales/' + language + '/' + files[i] + '.json', 'utf8').toString())
      }
    }

    // Write translations as a single JSON file per namespace, eg "en.json"
    fs.writeFileSync(rootDir+'/build/locales/'+language+'.json', JSON.stringify(translations[language]))

  })

}

// Load all UI languages
for (obj in languages) {
  loadLanguage(obj)
}

module.exports = translations

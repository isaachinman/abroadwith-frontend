/* eslint-disable */

// This is the nunjucks translation setup file
var languages = require('../src/data/constants/UILanguages.json')

var path = require('path')
var fs = require('fs')

var rootDir = path.resolve(__dirname, '..')
var translations = {}

// Function to re-assemble translation json
var loadLanguage = function(language) {

  /* eslint-disable */
  var util = require('util')
  var spawn = require('child_process').spawn
  var ls = spawn('ls', ['locales/' + language])

  ls.stdout.on('data', function (data) {
    var files = data.toString().split('.json\n')
    translations[language] = {}

    for (var i = 0; i < files.length; i++) {
      if (files[i].length > 1) {
        translations[language][files[i]] = JSON.parse(fs.readFileSync('./locales/' + language + '/' + files[i] + '.json', 'utf8').toString())
      }
    }

    fs.writeFileSync(rootDir+'/build/locales/'+language+'.json', JSON.stringify(translations[language]))

  })
  /* eslint-enable */

}

// Load all UI languages
/* eslint-disable */
for (obj in languages) {
  loadLanguage(obj)
}
/* eslint-enable */

module.exports = translations

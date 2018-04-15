/* eslint-disable */
/*

  This is a util to find unused translation keys
  Actual elimination of unused keys can just happen by hand
  Note: This only checks the English locale

  It's intentionally in ES5 so that you can run it directory from your terminal.
  If you're at the root dir of this repo, just do:

    node src/utils/translations/findUnusedKeys.js

*/

var findInFiles = require('find-in-files')
var fs = require('fs')
var path = require('path')

var localesPath = path.resolve(__dirname, '../../../locales/en')
var srcPath = path.resolve(__dirname, '../../../src')
var unusedKeys = {}

console.log(srcPath)

var filenames = fs.readdirSync(localesPath)
var iterator = 0
var unusedKeys = []

filenames.forEach(function(filename) {

  var namespace = filename.slice(0, -5)

  // Some namespaces are only ever looped through, and so will not appear hardcoded anywhere in the repo
  if (filename !== 'interests.json' && filename !== 'languages.json' && filename !== 'countries.json' && filename !== 'cities.json') {

    var keys = JSON.parse(fs.readFileSync(localesPath + '/' + filename, 'utf-8'))

    Object.keys(keys).forEach(function(key) {

      if (typeof key === 'string') {

        // This process is arbitrarily throttled because it is very memory intensive
        // If it crashes your machine, increase this iterator value
        iterator += 500

        var keyFullName = namespace + '.' + key

        setTimeout(function() {
          findInFiles.find(keyFullName, srcPath).then(function(results) {

            var numOfMatches = Object.keys(results).length
            if (numOfMatches === 0) {
              console.log('Unused key: ', keyFullName)
            }

          })
        }, iterator) // Throttle the function

      }

    })

  }

})

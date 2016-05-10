const filesystem = require("fs")
const util = require('util')

require('simple-git')('locales').pull('origin', 'master').then(function() {

  var results = []

  var getAllFilesFromFolder = function(dir) {

    var filesystem = require("fs")
    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {

      file = dir + '/' + file
      var stat = filesystem.statSync(file)

      if (file.indexOf('.git') === -1 && file.indexOf('src') === -1 && file.indexOf('server') === -1 && file.indexOf('pt') === -1 && file.indexOf('package') === -1) {
        if (stat && stat.isDirectory()) {
          results = results.concat(getAllFilesFromFolder(file))
        } else if (file.indexOf('json') > -1) {
          results.push(file)
        }
      }

    });

    return results

  }

  var listOfAllFiles = getAllFilesFromFolder('locales')
  var listOfUntranslatedKeys = []

  var listOfEnglishFiles = []
  for (var i = 0; i < listOfAllFiles.length; i++) {
    if (listOfAllFiles[i].indexOf('/en/') > -1) {
      listOfEnglishFiles.push({
        namespace: (listOfAllFiles[i].replace(/^.*[\\\/]/, '')).replace(/\.[^/.]+$/, ""),
        object: filesystem.readFileSync(listOfAllFiles[i], 'utf8')
      })
    }
  }

  var listOfForeignFiles = []
  for (var i = 0; i < listOfAllFiles.length; i++) {
    if (listOfAllFiles[i].indexOf('/en/') === -1) {
      listOfForeignFiles.push({
        language: listOfAllFiles[i].substring(8, 10),
        namespace: (listOfAllFiles[i].replace(/^.*[\\\/]/, '')).replace(/\.[^/.]+$/, ""),
        object: filesystem.readFileSync(listOfAllFiles[i], 'utf8')
      })
    }
  }

  for (var i=0; i < listOfForeignFiles.length; i++) {

    for (var y=0; y < listOfEnglishFiles.length; y++) {
      if (listOfForeignFiles[i].namespace == listOfEnglishFiles[y].namespace) {
        var englishFileToCompare = JSON.parse(listOfEnglishFiles[y].object)
      }
    }

    var foreignFileToCompare = JSON.parse(listOfForeignFiles[i].object)

    for (key in englishFileToCompare) {

      if (foreignFileToCompare[key] == undefined) {
        listOfUntranslatedKeys.push({
          language: listOfForeignFiles[i].language,
          namespace: listOfForeignFiles[i].namespace,
          untranslated: key
        })
      }
    }

  }



  for (var i = 0; i < listOfAllFiles.length; i++) {

    var fileToTest = JSON.parse(filesystem.readFileSync(listOfAllFiles[i], 'utf8'))

    for (key in fileToTest) {
      if (fileToTest.hasOwnProperty(key)) {
        var value = fileToTest[key]
        if (value == '') {
          listOfUntranslatedKeys.push({
            language: listOfAllFiles[i].substring(8, 10),
            namespace: ((listOfAllFiles[i].replace(/^.*[\\\/]/, '')).replace(/\.[^/.]+$/, "")),
            untranslated: key
          })
        }
      }
    }

  }

  if (listOfUntranslatedKeys.length > 0) {

    var notificationsObj = {}
    listOfUntranslatedKeys.forEach(function(obj) {
      if (notificationsObj[obj.language]) {
        notificationsObj[obj.language].push({
          key: obj.untranslated,
          namespace: obj.namespace
        })
      } else {
        notificationsObj[obj.language] = [{
          key: obj.untranslated,
          namespace: obj.namespace
        }]
      }
    })

    console.error('Untranslated keys found: ' + util.inspect(notificationsObj))

  }

  // Send emails based on status of translations
  const sendgrid = require('sendgrid')('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')

  // Compile status text
  var status = listOfUntranslatedKeys.length > 0 ? 'incomplete' : 'complete'

  // Compile body of email
  const languages = require('../src/global/constants/UILanguages.json')
  var body = ''
  if (status === 'complete') {
    body += 'All translations are up to date and complete. Please note that this tool merely checks for the existence of translations, and does nothing to verify their accuracy or content.'
  } else if (status === 'incomplete') {
    var listOfLanguages = ''
    var listPerLanguage = ''
    for (obj in notificationsObj) {
      listOfLanguages += languages[obj].name + ' '
      listPerLanguage += '<br><br>'
      listPerLanguage += '<strong>'+languages[obj].name+':</strong>'
      listPerLanguage += '<ul>'
      for (var i=0; i<notificationsObj[obj].length; i++) {
        listPerLanguage += '<li>'
        listPerLanguage += 'Namespace: '+notificationsObj[obj][i].namespace + ', '
        listPerLanguage += 'Key: '+notificationsObj[obj][i].key
        listPerLanguage += '</li>'
      }
      listPerLanguage += '</ul>'
    }
    body += 'There are incomplete translations.'
    body += '<br><br>'
    body +='There are incomplete translations in these languages: <strong>' + listOfLanguages + '</strong>'
    body += listPerLanguage
  }

  var email = new sendgrid.Email();
  email.addTo('isaac@isaachinman.com')
  email.addTo('bastian@abroadwith.com')
  email.addTo('jose@abroadwith.com')
  email.addTo('businessabroadwith@googlegroups.com')
  email.setFrom('translation-notifications@abroadwith.com')
  email.setFromName('Translation Notifications')
  email.setSubject('Translation completion report [' + status + ']')
  email.setHtml(body)

  sendgrid.send(email, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });

})

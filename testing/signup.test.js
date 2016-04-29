const $ = require('jquery')
const jQuery = require('jquery')
const select2 = require('select2-browserify')

casper.test.begin('Signup test', 5, function(test) {

    casper.start('http://localhost:3000', function() {
      test.assertUrlMatch('http://localhost:3000')
      test.assertExists('#sign-up-modal')
    })

    casper.then(function() {
      this.evaluate(function() {
        $('.select2.language').last().select2('open')
      })
    })

    casper.then(function() {
      test.assertVisible('ul.select2-results')
    })

    casper.then(function() {
      this.evaluate(function() {
        $('.select2.language').attr('data-lang','ENG')
      })
    })

    casper.then(function() {
      this.click('#apply-languages')
    })

    casper.then(function() {
      test.assertVisible('#email-signup-trigger')
    })

    casper.then(function() {
      this.click('#email-signup-trigger')
    })

    casper.then(function() {
      test.assertVisible('#email-signup')
    })

    casper.run(function() {
      test.done()
    })

})

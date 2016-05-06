const $ = require('jquery')
const jQuery = require('jquery')
const select2 = require('select2-browserify')

casper.test.begin('Signup test', 5, function(test) {

    casper.options.viewportSize = {
      width: 1600,
      height: 950
    }

    casper.options.waitTimeout = 20000

    casper.start('http://localhost:3000', function() {
      casper.evaluate(function() {
        localStorage.clear()
      })
      this.reload()
    })

    casper.then(function() {
      test.assertUrlMatch('http://localhost:3000')
    })

    casper.waitForSelector('main', function() {
      casper.capture('testing/screenshots/pre-signup.png');
      test.assertExists('#sign-up-modal')
      this.evaluate(function() {
        $('a[data-target=choose-languages-modal]').click()
      })
    })

    casper.then(function() {
      this.evaluate(function() {
        $('.select2.language').attr('data-lang','ENG')
        $('.material.language-level').val('NATIVE')
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

    casper.then(function() {
      this.evaluate(function() {

        var email = '';
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 5; i++ ) {
          email += possible.charAt(Math.floor(Math.random() * possible.length))
        }
        email = email + '@example.com'

        $('#first-name').val('test')
        $('#last-name').val('test')
        $('#email').val(email)
        $('#password').val('blue2222')
        $('#birthday').val('01-04-1998')
      })
    })

    casper.then(function() {
      this.evaluate(function() {
        $('#email-signup').click()
        casper.capture('testing/screenshots/signup.png')
      })
    })

    casper.waitUntilVisible('#confirmation-email-sent')

    casper.then(function() {
      test.assertVisible('#confirmation-email-sent')
    })

    casper.run(function() {
      casper.capture('testing/screenshots/signup.png');
    })

    casper.on("error", function(msg, trace) {
      this.echo("Error: " + msg, "ERROR");
    });

    casper.run(function() {
      casper.capture('testing/screenshots/signup-end.png')
      test.done()
    })

})

var login = require('./login');
var processLanguageChips = require('process-language-chips');

var domains = require('domains');
var application = require('application-settings');

// Language-learn select
$('select#learning-language').length ? $('select#learning-language').select2() : null;

// Language-known select
$('select#known-language').length ? $('select#known-language').select2() : null;

// If on signup page, remove language and signup modals
if(window.location.href.indexOf("signup") > -1) {
  $('#choose-languages-modal').length ? $('#choose-languages-modal').remove() : null;
  $('#sign-up-modal').length ? $('#sign-up-modal').remove() : null;
}

// If add learning language button exists, give it a click event
$('a#add-learning-language').length ? $('a#add-learning-language').click(function() { processLanguageChips('learning'); }) : null;

// If add known language button exists, give it a click event
$('a#add-known-language').length ? $('a#add-known-language').click(function() { processLanguageChips('known'); }) : null;

// Form submit
if ($('form#email-signup-form').length) {

  // Create signup object
  newUser = {};

  // Birthday datepicker
  if ($('.datepicker-birthday').length) {

    // Get date for 18 years ago
    require('../../src/utils/date-object-to-yyyymmdd');
    var eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear()-18);
    eighteenYearsAgo = eighteenYearsAgo.yyyymmdd();

    // $('.datepicker-birthday').pickadate({
    //   max: eighteenYearsAgo,
    //   container: 'body',
    //   clear: '',
    //   today: '',
    //   selectYears: 35,
    //   format: 'yyyy-mm-dd',
    //   onSet: function(e) {
    //     if (e.select) {
    //       this.close();
    //     }
    //   }
    // });

  }

  //  Initialise and setup Facebook js sdk
  window.fbAsyncInit = function() {
    FB.init({
      appId: application.facebookAppId,
      xfbml: true,
      version: 'v2.5'
    });
  };
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  $('#fb-signup').click(function() {
    fbSignup();
  })

  // Open log in/authorise dialog, fill fields if response is returned as connected
  function fbSignup() {
    FB.login(function(response) {
      if (response.status === 'connected') {

        console.log(response.authResponse);
        newUser.facebookId = response.authResponse.userID;
        console.log(response.authResponse.accessToken);

        var loginObj = {};
        loginObj.facebookToken = response.authResponse.accessToken;

        FB.api('/me', {
          fields: 'first_name,last_name,email,birthday,gender,age_range'
        }, function(response) {
          newUser["firstName"] = response.first_name;
          newUser["lastName"] = response.last_name;
          newUser["email"] = response.email;
          newUser["birthDate"] = response.birthday === 'undefined' ? (response.birthday).substring(6, 10) + '-' + (response.birthday).substring(0, 2) + '-' + (response.birthday).substring(3, 5) : eighteenYearsAgo;
          console.log(newUser);

          loginObj.email = response.email;

          $.ajax({
            type: "POST",
            url: domains.API + '/users',
            data: JSON.stringify(newUser),
            contentType: "application/json",
            processData: false,
            success: function(response) {

              login(loginObj)

            },
            error: function(response) {
              // Something went wrong
            }
          });

        })
      } else if (response.status === 'not_authorized') {
        // Not authorised
      } else {
        // Not logged into Facebook
      }
    }, {
      scope: 'public_profile,email,user_birthday'
    })
  }

  // Main google script
  $.getScript('https://apis.google.com/js/platform.js');

  window.googleSignupCounter = 0;
  setTimeout(function() {
    googleSignupCounter === 0 ? googleSignupCounter = 1 : null;
  }, 3000)
  window.googleSignup = function(googleUser) {

    if (++googleSignupCounter < 2) {
      return;
    }

    var profile = googleUser.getBasicProfile();
    newUser["firstName"] = profile.getGivenName();
    newUser["lastName"] = profile.getFamilyName();
    newUser["email"] = profile.getEmail();
    newUser["birthDate"] = eighteenYearsAgo;
    newUser["googleId"] = googleUser.getBasicProfile().getId();

    console.log(newUser)

    var loginObj = {
      email: newUser["email"],
      googleToken: googleUser.getAuthResponse().id_token
    }

    $.ajax({
      type: "POST",
      url: domains.API + '/users',
      data: JSON.stringify(newUser),
      contentType: "application/json",
      processData: false,
      success: function(response) {

        console.log(response);

        login(loginObj)

      },
      error: function(response) {
        // Something went wrong
      }
    });
  }

  // Set permanent vars
  var emailSignup = $('button#email-signup');
  var notValid = $('#not-valid');
  var passwordValidate = $('#password-not-valid')
  var formValid;

  // This function is called when a user hasn't fully filled in the form
  function formNotValid() {
    notValid.hasClass('hide') ? notValid.removeClass('hide') : null;
    formValid = false;
  }

  // This function is called when a password isn't correct
  function passwordNotValid() {
    passwordValidate.hasClass('hide') ? passwordValidate.removeClass('hide') : null
    formValid = false;
  }

  // Language submit
  function applyLanguages() {

    if ($('#language-known-chips').find('.language-known-chip').length > 0) {

      // Mandatory known languages
      newUser["userKnownLanguages"] = [];

      // Get native languages
      $('.language-known-chip').each(function() {

        newUser.userKnownLanguages.push({
          "language": $(this).attr('data-lang'),
          "level": $(this).attr('data-level')
        });

      })

      // Get learning languages
      if ($('#language-learning-chips').find('.language-learning-chip').length) {

        newUser["userLearningLanguages"] = [];
        $('.language-learning-chip').each(function() {

          newUser.userLearningLanguages.push({
            "language": $(this).attr('data-lang'),
            "level": $(this).attr('data-level')
          });

        })

      }

      if ($('#choose-languages-modal').length) {
        $('#choose-languages-modal').closeModal();
        $('#sign-up-modal').openModal();
      }

      if ($('#apply-languages-signup-page').length) {
        $('#choose-languages').hide();
        $('#sign-up').show();
      }

    } else {
      if ($('#languages-not-valid').hasClass('hide')) {
        $('#languages-not-valid').removeClass('hide');
      }
    }
  }

  $('#apply-languages').click(function() {
    applyLanguages();
  });

  if ($('#apply-languages-signup-page').length) {
    $('#apply-languages-signup-page').click(function() {
      applyLanguages();
    })
  }

  // Email signup process
  emailSignup.click(function() {

    if ($('form#email-signup-form input').length && $('input#birthday').val() != undefined) {

      // Get inputs
      var signupForm = $('form#email-signup-form input.validate');

      // Loop through text inputs and add values to object
      for (var i = 0, ii = signupForm.length; i < ii; i++) {
        var input = signupForm[i];
        if (input.value !== '') {
          newUser[input.name] = input.value;
          formValid = true;
        } else {
          formNotValid();
          break;
        }
      }

      // Get birthday
      if ($('input#birthday').val() != '') {
        newUser['birthDate'] = $('input#birthday').val();
      } else {
        formNotValid();
      }

      // Validate password
      var password = newUser.password ? newUser.password : '';
      var nameStrings = newUser.firstName && newUser.lastName ? newUser.firstName.split(' ').concat(newUser.lastName.split(' ')) : [];

      for (var i = 0, len = nameStrings.length; i < len; i++) {
        if (typeof password !== 'undefined' && password.indexOf(nameStrings[i]) !== -1) {
          passwordNotValid()
          break;
        }
      }

      if (password.length < 8 || !(password.match(/[a-z]/)) || !(password.match(/[A-Z]/) || /\d/.test(password))) {
        passwordNotValid()
      }

      // If form is valid, POST object
      if (formValid === true) {
        console.log(newUser)
        validateUserAndSend()
      } else {
        formNotValid();
      }

    } else {
      formNotValid();
    }

  });

  function validateUserAndSend() {
    if (newUser.hasOwnProperty('firstName') && newUser.hasOwnProperty('lastName') && newUser.hasOwnProperty('email') && newUser.hasOwnProperty('birthDate')) {

      $('#preloader').show();

      var email = newUser.email;
      var password = newUser.password;

      var loginObj = {
        email: email,
        password: password
      }

      $.ajax({
        type: "POST",
        url: domains.API + '/users',
        data: JSON.stringify(newUser),
        contentType: "application/json",
        processData: false,
        success: function(response) {

          console.log(response);
          login(loginObj);

        },
        error: function(response) {

          $('#preloader').hide();
          alert('Signup failed');

        }
      });
    }
  }
}

if ($('a#email-signup-trigger').length) {
  $('a#email-signup-trigger').click(function() {
    $('#email-signup-collapsible .collapsible-header').hide();
  })
  $('#email-signup-collapsible .collapsible-header').click(function() {
    $('#email-signup-collapsible .collapsible-header').hide();
  })
}

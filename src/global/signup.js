var domains = require('domains');
var login = require('./login');
var jwt_decode = require('jwt-decode');

// Language-learn select
$('select#learning-language').length ? $('select#learning-language').select2() : null;

// Language-known select
$('select#known-language').length ? $('select#known-language').select2() : null;

// Process language chips
var processLanguageChips = require('process-language-chips')

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

    $('.datepicker-birthday').pickadate({
      max: eighteenYearsAgo,
      container: 'body',
      selectYears: true,
      format: 'yyyy-mm-dd',
      onSet: function() {
        this.close();
      }
    });

  }

  //  Initialise and setup Facebook js sdk
  window.fbAsyncInit = function() {
    FB.init({
      appId: '144997212531478',
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
          newUser["birthDate"] = (response.birthday).substring(6, 10) + '-' + (response.birthday).substring(0, 2) + '-' + (response.birthday).substring(3, 5);
          console.log(newUser);

          loginObj.email = response.email;

          $.ajax({
            type: "POST",
            url: 'https://admin.abroadwith.com/users',
            data: JSON.stringify(newUser),
            contentType: "application/json",
            processData: false,
            success: function(response) {

              console.log(response);

              console.log(JSON.stringify(loginObj));

              $.ajax({
                type: "POST",
                url: 'https://admin.abroadwith.com/users/login',
                contentType: "application/json",
                data: JSON.stringify(loginObj),
                success: function(JWT) {

                  console.log(JWT);
                  localStorage.setItem('JWT', JWT.token);

                  // Print username into navbar
                  $('span#navbar-username').html((jwt_decode(localStorage.getItem('JWT'))).name)

                  // Toggle navbars
                  $('#navbar').hide();
                  $('#navbar-logged-in').show();
                  $('#navbar-logged-in .right').fadeIn('fast');

                  // If any modal is open, close it
                  if ($('.modal')) {
                    $('.modal').closeModal();
                    $('.lean-overlay').remove()
                  }

                }
              })

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

  // Google signup function
  window.onSignIn = function(googleUser) {
    var profile = googleUser.getBasicProfile();
    newUser["firstName"] = profile.getGivenName();
    newUser["lastName"] = profile.getFamilyName();
    newUser["email"] = profile.getEmail();
    newUser["birthDate"] = eighteenYearsAgo;
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

    if ($('#language-known-chips').find('.language-known-chip').length) {

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

      $('#choose-languages-modal').closeModal();
      $('#sign-up-modal').openModal();

    } else {
      if ($('#languages-not-valid').hasClass('hide')) {
        $('#languages-not-valid').removeClass('hide');
      }
    }
  }

  $('#apply-languages').click(function() {
    applyLanguages();
  });

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

      $.ajax({
        type: "POST",
        url: 'https://admin.abroadwith.com/users',
        data: JSON.stringify(newUser),
        contentType: "application/json",
        processData: false,
        success: function(response) {

          console.log(response);
          login(email, password);

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

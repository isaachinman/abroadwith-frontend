var domains = require('domains');
var login = require('./login');

// Language-learn select
if ($('select#learning-language').length) {
  $('select#learning-language').select2();
}

// Language-known select
if ($('select#known-language').length) {
  $('select#known-language').select2();
}

// Process language chips
var processLanguageChips = require('process-language-chips')

if ($('a#add-learning-language').length) {
  $('a#add-learning-language').click(function() {
    processLanguageChips('learning');
  })
}

if ($('a#add-known-language').length) {
  $('a#add-known-language').click(function() {
    processLanguageChips('known');
  })
}

// Form submit
if ($('form#signup').length) {

  // Create signup object
  newUser = {};

  // Birthday datepicker
  if ($('.datepicker-birthday').length) {

    // Get date for 18 years ago
    var eighteenYearsAgo = new Date();
    eighteenYearsAgo.setTime(eighteenYearsAgo.valueOf() - 18 * 365 * 24 * 60 * 60 * 1000);
    require('../../src/utils/date-object-to-yyyymmdd');
    eighteenYearsAgo = eighteenYearsAgo.yyyymmdd();

    $('.datepicker-birthday').pickadate({
      max: eighteenYearsAgo,
      container: 'body',
      selectYears: true,
      format: 'yyyy-mm-dd'
    });

  }

  //  Initialise and setup Facebook js sdk
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '144997212531478',
      xfbml      : true,
      version    : 'v2.5'
    });
  };
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

   $('#fb-login').click(function() {
     fbLogin();
   })

   // Open log in/authorise dialog, fill fields if response is returned as connected
   function fbLogin() {
      FB.login(function(response) {
       if (response.status === 'connected') {
         console.log(response.authResponse.accessToken);
         FB.api('/me', {fields: 'first_name,last_name,email,birthday,gender,age_range'}, function(response) {
           newUser["firstName"] = response.first_name;
           newUser["lastName"] = response.last_name;
           newUser["email"] = response.email;
           newUser["birthday"] = (response.birthday).substring(6,10)+'-'+(response.birthday).substring(3,5)+'-'+(response.birthday).substring(0,2);
           console.log(newUser);
         })
       } else if (response.status === 'not_authorized') {
         // Not authorised
       } else {
         // Not logged into Facebook
       }
     }, {scope: 'public_profile,email,user_birthday'} )
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
  var emailSignup = $('a#email-signup');
  var notValid = $('#not-valid');
  var passwordValidate = $('#password-not-valid')
  var formValid;

  // This function is called when a user hasn't fully filled in the form
  function formNotValid() {
    if (notValid.hasClass('hide')) {
      notValid.removeClass('hide');
    }
    formValid = false;
  }

  // This function is called when a password isn't correct
  function passwordNotValid() {
    if (passwordValidate.hasClass('hide')) {
      passwordValidate.removeClass('hide');
    }
    formValid = false;
  }

  // Language submit
  function applyLanguages() {

    if ($('#language-known-chips').find('.language-known-chip').length) {

      // Mandatory known languages
      newUser["userKnownLanguages"] = [];

      // Get native languages
      $('.language-known-chip').each(function() {
        var newLanguageKnown = {
          "language": $(this).attr('data-lang'),
          "level": $(this).attr('data-level')
        }
        newUser.userKnownLanguages.push(newLanguageKnown);
      })

      // Get learning languages
      if ($('#language-learning-chips').find('.language-learning-chip').length) {

        newUser["userLearningLanguages"] = [];
        $('.language-learning-chip').each(function() {
          var newLanguage = {
            "language": $(this).attr('data-lang'),
            "level": $(this).attr('data-level')
          }
          newUser.userLearningLanguages.push(newLanguage);
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

    if ($('form#signup input').length && $('input#birthday').val() != undefined) {

      // Get inputs
      var signupForm = $('form#signup input.validate');

      // Loop through text inputs and add values to object
      for (var i=0, ii = signupForm.length; i<ii; i++) {
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

      for (var i=0, len=nameStrings.length; i<len; i++) {
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
        success: function(response){

          console.log(response);
          login(email, password);

        },
        error: function(response) {
          // Something went wrong
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

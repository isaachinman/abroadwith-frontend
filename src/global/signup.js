var select2 = require('select2');

// Language-learn select
if ($('select#language-learning').length) {
  $('select#language-learning').select2({
    placeholder: "Pick a language"
  });
}

// Level select
if ($('select#language-level').length) {
  $('select#language-level').select2({
    placeholder: "Level"
  });
}

// Language-known select
if ($('select#language-known').length) {
  $('select#language-known').select2({
    placeholder: "Pick a language"
  });
}

// Add language-learn click handler
if ($('a#add-language').length && $('#language-learning').length && $('#language-level').length && $('#language-chips').length) {

  $(function() {

    // Set permanent vars
    var addLanguage = $('a#add-language');
    var chipContainer = $('#language-chips');
    var languageLearning = $('#language-learning');
    var levelLearning =  $('#language-level');

    addLanguage.click(function() {

      // Set conditional vars
      var languageCode = $('#language-learning option:selected').attr('data-lang');
      var levelCode =  $('#language-level option:selected').attr('data-level');

      if (languageLearning.val() != '' && levelLearning.val() != '' && $('.chip[data-lang="'+languageCode+'"]').length <= 0) {

        // Remove initial chip
        if ($('#language-chips').find($('.initial').length)) {
          $('#language-chips').find($('.initial')).remove();
        }

        var newLanguage = '<div class="language-chip chip" data-lang="' + languageCode + '" data-level="' + levelCode + '">' + languageLearning.val() + ' (' + levelLearning.val() + ')<i class="material-icons">close</i></div>'
        chipContainer.append(newLanguage);

        languageLearning.select2('val', '');
        languageLearning.val('');
        levelLearning.select2('val', '');
        levelLearning.val('');

      }
    })
  })
}

// Language known click handler
if ($('a#add-language-known').length && $('#language-known').length && $('#language-known-chips').length) {

  $(function() {

    // Set permanent vars
    var addLanguage = $('a#add-language-known');
    var chipContainer = $('#language-known-chips');
    var languageKnown = $('#language-known');

    addLanguage.click(function() {

      // Set conditional vars
      var languageKnownCode = $('#language-known option:selected').attr('data-lang');

      if (languageKnown.val() != '' && $('.chip[data-lang="'+languageKnownCode+'"]').length <= 0) {

        // Remove initial chip
        if ($('#language-known-chips').find($('.initial').length)) {
          $('#language-known-chips').find($('.initial')).remove();
        }

        var newLanguage = '<div class="language-known chip" data-lang="' + languageKnownCode + '">' + languageKnown.val() + ' (Native)<i class="material-icons">close</i></div>'
        chipContainer.append(newLanguage);

        languageKnown.select2('val', '');
        languageKnown.val('');

      }
    })
  })
}

// Form submit
if ($('form#signup').length && $('a#create-user').length && $('#not-valid').length) {

  // Create signup object
  newUser = {};

  //  Initialise and setup Facebook js sdk
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '144997212531478',
      xfbml      : true,
      version    : 'v2.5'
    });
  };

  // More Facebook init stuff
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
           newUser["birthday"] = (response.birthday).substring(3,5)+'/'+(response.birthday).substring(0,2)+'/'+(response.birthday).substring(6,10);
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
     console.log(profile);
     newUser["firstName"] = profile.getGivenName();
     newUser["lastName"] = profile.getFamilyName();
     newUser["email"] = profile.getEmail();
   }

  // Set permanent vars
  var createUser = $('a#create-user');
  var notValid = $('#not-valid');
  var formValid;

  // This function is called when a user hasn't fully filled in the form
  function formNotValid() {
    if (notValid.hasClass('hide')) {
      notValid.removeClass('hide');
    }
    formValid = false;
  }

  require('./language-chips.js');

  createUser.click(function() {

    if ($('form#signup input').length && $('input#birthday').val() != undefined) {

      // Get inputs
      var signupForm = $('form#signup input.validate');

      // Loop through text inputs and add values to object
      for (var i=0, ii = signupForm.length; i<ii; i++) {
        var input = signupForm[i];
        if (input.value != '') {
          newUser[input.name] = input.value;
          formValid = true;
        } else {
          console.log('tripping')
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

      // If form is valid, POST object
      if (formValid == true) {
        var letsSee = JSON.stringify(newUser);
        console.log(letsSee);
      }

    } else {
      formNotValid();
    }

  });
}

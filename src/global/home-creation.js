if ($('a.become-a-host').length) {

  $('a.become-a-host').click(function() {

    $.ajax({
      type: "POST",
      url: 'https://admin.abroadwith.com/users/1/homes',
      data: JSON.stringify(newUser),
      contentType: "application/json",
      processData: false,
      success: function(response){

        console.log(response);

        // Need to get home id and redirect to /users/{userId}/homes/{id}

      },
      error: function(response) {
        // Something went wrong
      }
    });

  })

}

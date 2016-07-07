const jwt_decode = require('jwt-decode')

const POST = require('POST')

const domains = require('domains')
const refreshToken = require('refresh-token')

if ($('a.become-a-host').length) {

  $('a.become-a-host').click(function() {

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null

    if (JWT.cbk !== 0) {

      // User needs verifications, open verifications modal
      $('#verifications-modal').openModal()

    } else if (!JWT.hid) {

      $('#preloader').show()

      var url = domains.API+'/users/'+JWT.rid+'/homes'
      var data = {}
      var success = function() {

        // Send home creation tracking event
        ga('send', 'event', 'host_events', 'home_created')
        fbq('track', 'Lead')

        refreshToken(function() {
          window.location = '/manage-home'
        })
      }
      POST(url, data, success)

    }

  })

}

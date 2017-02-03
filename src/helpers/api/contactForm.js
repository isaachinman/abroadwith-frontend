import superagent from 'superagent'

export default (app) => {

  // This is the contact form endpoint
  app.post('/contact-us', (req, res) => {

    const supportRequest = req.body

    console.log(supportRequest)

    // Send email via SendGrid
    // Their docs are all in ES5, so whatever

    /* eslint-disable */
    const helper = require('sendgrid').mail
    const from_email = new helper.Email(supportRequest.email)
    const to_email = new helper.Email('support@abroadwith.com')
    const subject = `New Support Request [${supportRequest.firstName} ${supportRequest.lastName}]`
    const content = new helper.Content('text/plain', supportRequest.message)
    const mail = new helper.Mail(from_email, subject, to_email, content)

    const sg = require('sendgrid')('***REMOVED***')
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    })

    sg.API(request, function (error, response) {
      res.sendStatus(200)
    })
    /* eslint-enable */

    // If the user is not logged in, create a Hubspot contact
    // but do not let the success of this request impact overall status
    if (supportRequest.newContact) {

      const hubspotRequest = superagent.post('https://api.hubapi.com/contacts/v1/contact/?hapikey=***REMOVED***')
      hubspotRequest.send({
        properties: [
          {
            property: 'email',
            value: supportRequest.email,
          },
          {
            property: 'firstname',
            value: supportRequest.firstName,
          },
          {
            property: 'lastname',
            value: supportRequest.lastName,
          },
        ],
      })

      hubspotRequest.end((err, { body } = {}) => {
        console.log(body)
      })

    }

  })

}

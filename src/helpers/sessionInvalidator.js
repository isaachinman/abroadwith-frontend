import config from 'config'
import jwtDecode from 'jwt-decode'
import moment from 'moment'
import sessionInvalidatorPage from './html/sessionInvalidatorPage.js'
// import logger from 'helpers/logger'


// This is a session invalidator -----------------------------------------------
// Because some things, like cookies and the redux store (in localstorage) are
// stored across sessions, sometimes breaking changes can lead to complete
// app failures. Use this utility as needed to invalidate sessions based on
// whatever conditions are needed.
// -----------------------------------------------------------------------------

export default (app) => {

  app.get('*', (req, res, next) => {

    if (req.cookies.access_token) {

      const expiry = moment(jwtDecode(req.cookies.access_token).exp * 1000)

      if (expiry.isBefore(moment())) {

        console.log('inside invalidation case')
        console.log(jwtDecode(req.cookies.access_token))
        console.log(expiry)

        res.cookie('access_token', 'null', { secure: true, httpOnly: true, expires: new Date(0), domain: config.cookieDomain })
        res.header('Access-Control-Allow-Credentials', 'true')

        return res.send(sessionInvalidatorPage) // eslint-disable-line

      }

    }

    next()


  })

}

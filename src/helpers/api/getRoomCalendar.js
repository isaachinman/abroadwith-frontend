import config from 'config'
import superagent from 'superagent'

export default (app) => {

  // This is the (public) room calendar endpoint
  app.get('/public/room-availability-calendar/:roomID', (req, res) => {

    const request = superagent.get(`http://${config.solr.host}:${config.solr.port}/solr/abroadwith_rooms/select?q=roomId:${req.params.roomID}&wt=json`)
    request.buffer()
    request.end((err, solrRes) => {

      if (err) {

        // Error
        res.sendStatus(500)

      } else {

        // Success
        const response = JSON.parse(solrRes.text).response
        const roomCalendar = {
          unavailabilities: [],
        }

        if (response.numFound === 1 && (response.docs[0].bookingDateRanges || response.docs[0].roomUnavailableDateRanges)) {

          let combinedUnavailabilities = []

          if (response.docs[0].bookingDateRanges) {
            combinedUnavailabilities = combinedUnavailabilities.concat(response.docs[0].bookingDateRanges)
          }

          if (response.docs[0].roomUnavailableDateRanges) {
            combinedUnavailabilities = combinedUnavailabilities.concat(response.docs[0].roomUnavailableDateRanges)
          }

          roomCalendar.unavailabilities = combinedUnavailabilities.map(timespan => {
            const parsedDates = ((timespan.replace(/[[\]']/g, '')).split(' TO '))
            return {
              start: parsedDates[0],
              end: parsedDates[1],
            }
          })
        }

        return res.send(JSON.stringify(roomCalendar))

      }
    })
  })
}

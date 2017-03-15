import config from 'config'
import superagent from 'superagent'

export default (app) => {

  // This is the public endpoint to return the closest (within 50km) city to a given lat/lng point
  app.post('/public/closest-city', (req, res) => {

    console.log('REQUEST BODY: ', req.body)

    const request = superagent.get(`${config.solr.host}:${config.solr.port}/solr/abroadwith_cities/select?q=*&wt=json&fq={!geofilt%20pt=${req.body.lat},${req.body.lng}%20sfield=location%20d=50}`)
    request.end((error, response = {}) => {

      if (error) {

        return res.sendStatus(500)

      }

          // GET was successful
      console.log('RESPONSE: ', JSON.parse(response.text).response)
      const parsedResponse = JSON.parse(response.text).response

      if (parsedResponse.numFound === 1) {
        return res.send({ cityName: parsedResponse.docs[0].name })
      }

      return res.sendStatus(500)


    })
  })
}

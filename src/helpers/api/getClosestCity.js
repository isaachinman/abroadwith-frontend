import config from 'config'
import superagent from 'superagent'

export default (app) => {

  // This is the public endpoint to return the closest (within 50km) city to a given lat/lng point
  app.post('/public/closest-city', (req, res) => {

    const request = superagent.get(`${config.solr.host}:${config.solr.port}/solr/abroadwith_cities/select?wt=json&q={!func}geodist()&sfield=location&pt=${req.body.lat},${req.body.lng}&sort=score asc&rows=1`)
    request.end((error, response = {}) => {

      if (error) {

        console.log(error)
        return res.sendStatus(500)

      }

      // GET was successful
      const parsedResponse = JSON.parse(response.text).response

      if (parsedResponse.numFound >= 1) {
        return res.send({ cityName: parsedResponse.docs[0].name })
      }

      return res.sendStatus(404)


    })
  })
}

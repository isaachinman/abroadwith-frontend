import config from 'config'
import superagent from 'superagent'

export default (app) => {

  // This is the public endpoint to return the closest (within 50km) city to a given lat/lng point
  app.post('/public/educator-courses', (req, res) => {

    const request = superagent.get(`${config.solr.host}:${config.solr.port}/solr/abroadwith_courses/select?q=educatorId%3A${req.body.educatorID}&wt=json&indent=true&rows=100`)
    request.end((error, response = {}) => {

      if (error) {

        console.log(error)
        return res.sendStatus(500)

      }

      // GET was successful
      const parsedResponse = JSON.parse(response.text).response

      if (parsedResponse.numFound >= 1) {
        return res.send(parsedResponse.docs)
      }

      return res.sendStatus(404)


    })
  })
}

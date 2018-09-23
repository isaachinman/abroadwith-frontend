import config from 'config'
import moment from 'moment'
import superagent from 'superagent'

export default (app) => {

  // This is the (public) room calendar endpoint
  app.get('/public/course-cities', (req, res) => {

    const fs = require('fs') // eslint-disable-line
    let data = null

    // If cities exist, and were fetched within the time limit, use them locally
    if (fs.existsSync('build/course-data/cities.json') &&
      fs.existsSync('build/course-data/cities.lock') &&
      moment(fs.readFileSync('build/course-data/cities.lock', 'utf-8')).isAfter(moment())) {

      data = JSON.parse(fs.readFileSync('build/course-data/cities.json', 'utf-8'))
      return res.send(JSON.stringify(data))

    }

    // Sometimes new course cities are added by the business team
    // This application refreshes them every day (async depending on actual use)
    const request = superagent.get(`${config.solr.host}:${config.solr.port}/solr/abroadwith_cities/select?q=*&wt=json&fl=location_0_coordinate,location_1_coordinate,name&rows=1000`)
    request.end((error, response = {}) => {

      if (error) {

        res.sendStatus(500)

      } else {

          // GET was successful
        data = JSON.parse(response.text).response.docs

        fs.writeFile('build/course-data/cities.json', JSON.stringify(data))
        fs.writeFile('build/course-data/cities.lock', moment().add(1, 'days').toString()) // Adjust cache life here

        return res.send(JSON.stringify(data))

      }

    })
  })
}

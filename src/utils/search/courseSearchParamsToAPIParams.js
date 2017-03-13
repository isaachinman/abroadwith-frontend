// This util converts an FE course search object into an object
// which is consumable by the BE endpoint

// The purpose of this is to keep the course search object on the FE
// similar to the homestay search object so that code can be reused

// NB: Currently, we do not support open date searching, but that will change
// Once it is supported, simply remove the || on startDate and endDate

import { apiDate } from 'utils/dates'
import moment from 'moment'

export default params => {

  console.log('original params: ', params)

  const apiParams = Object.assign({}, params, {
    categories: params.categories ? [params.categories] : [],
    language: params.language || 'SPA',
    startDate: params.arrival || apiDate(moment()),
    endDate: params.departure || apiDate(moment().add(2, 'weeks')),
    rectangularBounds: {
      point1: {
        lat: params.mapData.bounds.maxLat,
        lng: params.mapData.bounds.maxLng,
      },
      point2: {
        lat: params.mapData.bounds.minLat,
        lng: params.mapData.bounds.minLng,
      },
    },
  })

  delete apiParams.arrival
  delete apiParams.departure
  delete apiParams.mapData

  return apiParams

}

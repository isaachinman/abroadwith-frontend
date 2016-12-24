import moment from 'moment'

export default function uiDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

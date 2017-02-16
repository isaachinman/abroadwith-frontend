const weekdayLookup = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
}

export default function sortByDayOfWeek(array) {

  return array.sort((x, y) => weekdayLookup[x.dayOfWeek] - weekdayLookup[y.dayOfWeek])

}

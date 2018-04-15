export default (array) => {

  const newArray = array.filter(language => {
    return language.language && language.level
  }).map(language => {
    delete language.id // eslint-disable-line
    return language
  })

  return newArray

}

export default function parsePhotoOrder(inputArray) {

  const orderedPhotos = inputArray.sort((a, b) => {
    return +a.split(',')[1] - +b.split(',')[1]
  }).map(item => {
    return item.split(',')[0]
  })

  return orderedPhotos

}

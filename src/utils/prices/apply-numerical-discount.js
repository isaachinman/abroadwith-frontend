export default function applyNumericalDiscount(number, discount) {

  console.log(number, discount)

  console.log((100 - discount) / 100)

  return number * ((100 - discount) / 100)

}

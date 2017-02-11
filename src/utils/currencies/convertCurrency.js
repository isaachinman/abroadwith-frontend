export default function convertCurrency(rates, from, to, value) {

  // Convert price
  const toNewCurrency = value / rates[from]
  return Math.ceil(toNewCurrency * rates[to])

}

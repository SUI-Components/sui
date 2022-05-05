const formatFactory =
  ({delimeter}) =>
  ({value = 0}) =>
    `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimeter)}`

const numberWithDots = formatFactory({delimeter: '.'})
const numberWithCommas = formatFactory({delimeter: ','})

export {numberWithDots, numberWithCommas}

const numberWithDots = ({ value = 0 }) =>
  `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

const numberWithCommas = ({ value = 0 }) =>
  `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export { numberWithDots, numberWithCommas };

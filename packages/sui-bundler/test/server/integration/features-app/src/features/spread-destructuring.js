const array = [1, 2, 3]
const object = {a: 1, b: 2}

const [head, ...tail] = array
const {a, ...rest} = object

const restoredArray = [head, ...tail]
const restoresObject = {a, ...rest}

console.log({restoredArray, restoresObject})

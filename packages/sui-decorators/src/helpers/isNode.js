const checkIsNode = () => {
  try {
    return Object.prototype.toString.call(global.process) === '[object process]'
  } catch (e) {
    return false
  }
}

const isNode = checkIsNode()

export default isNode

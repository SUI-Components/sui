let isNode = false

// Only Node.JS has a process variable that is of [[Class]] process
try {
  isNode = Object.prototype.toString.call(global.process) === '[object process]'
} catch (e) {}

export default isNode

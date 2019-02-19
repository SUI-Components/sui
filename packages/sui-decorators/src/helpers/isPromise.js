export default obj =>
  typeof obj !== 'undefined' && typeof obj.then === 'function'

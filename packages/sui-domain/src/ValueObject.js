import AnemicModel from './AnemicModel.js'
import inherits from './inherits.js'

const ValueObject = (function (_AnemicModel) {
  inherits(ValueObject, _AnemicModel)

  function ValueObject() {
    return _AnemicModel.apply(this, arguments) || this
  }

  return ValueObject
})(AnemicModel)

export {ValueObject as default}

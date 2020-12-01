import inherits from './inherits'
import AnemicModel from './AnemicModel'

const ValueObject = (function(_AnemicModel) {
  inherits(ValueObject, _AnemicModel)

  function ValueObject() {
    return _AnemicModel.apply(this, arguments) || this
  }

  return ValueObject
})(AnemicModel)

export {ValueObject as default}

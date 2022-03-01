import inherits from './inherits.js'
import AnemicModel from './AnemicModel.js'

const Entity = (function (_AnemicModel) {
  inherits(Entity, _AnemicModel)

  function Entity() {
    return _AnemicModel.apply(this, arguments) || this
  }

  return Entity
})(AnemicModel)

export {Entity as default}

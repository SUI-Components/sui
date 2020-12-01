import inherits from './inherits'
import AnemicModel from './AnemicModel'

const Entity = (function(_AnemicModel) {
  inherits(Entity, _AnemicModel)

  function Entity() {
    return _AnemicModel.apply(this, arguments) || this
  }

  return Entity
})(AnemicModel)

export {Entity as default}

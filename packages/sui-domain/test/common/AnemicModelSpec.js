/* eslint-disable no-undef */
import {Entity, ValueObject} from '../../src'
import {expect} from 'chai'

class TestValueObject extends ValueObject {
  testMethodVO() {
    return this._property1 + ' ' + this._property2
  }
}

class TestEntity extends Entity {
  testMethodEntity() {
    return this._property1 + ' ' + this._property2
  }
}

class TestEntityRetroCompatibilityWithSuperAndProps extends Entity {
  constructor(properties) {
    super(properties)
    this._property12 = properties.property12
    this._property13 = properties.property13
  }
}

class TestEntityRetroCompatibilityWithEmptySuper extends Entity {
  constructor(properties) {
    super()
    this._property12 = properties.property12
    this._property13 = properties.property13
  }
}

describe('AnemicModelSpec', () => {
  it('should create a TestValueObject with the properties setted with underscore', () => {
    const testVO = new TestValueObject({
      property1: 'John',
      property2: 'Doe',
      entity: new TestEntity({entityProp1: 'Jeremy', entityProp2: 'Johns'})
    })
    expect(testVO).to.have.keys('_property1', '_property2', '_entity')
  })

  it('should transform our entity to JSON deeply, in the way that we expect', () => {
    const testVO = new TestValueObject({
      property1: 'John',
      property2: 'Doe',
      property3: {
        entities: [
          new TestEntity({entityProp1: 'David', entityProp2: 'Smith'}),
          new TestValueObject({entityProp1: 'Michael', entityProp2: 'Johnson'})
        ]
      },
      entity: new TestEntity({entityProp1: 'Jeremy', entityProp2: 'Johns'})
    })
    const expectedJSON = {
      property1: 'John',
      property2: 'Doe',
      property3: {
        entities: [
          {entityProp1: 'David', entityProp2: 'Smith'},
          {entityProp1: 'Michael', entityProp2: 'Johnson'}
        ]
      },
      entity: {entityProp1: 'Jeremy', entityProp2: 'Johns'}
    }
    expect(testVO.toJSON()).to.deep.equal(expectedJSON)
  })

  it('should not add methods to our ValueObject just properties.', () => {
    const testVO = new TestEntity({
      property1: 'John',
      property2: 'Doe'
    })
    expect(testVO).to.not.have.keys('_testMethodVO')
  })

  it('should maintain retrocompatibility with the current system on entities and VO calling super passing props', () => {
    const testVO = new TestEntityRetroCompatibilityWithSuperAndProps({
      property12: 'John',
      property13: 'Doe'
    })
    expect(testVO).to.have.keys('_property12', '_property13')
  })

  it('should maintain retrocompatibility with the current system on entities and VO calling an empty super.', () => {
    const testVO = new TestEntityRetroCompatibilityWithEmptySuper({
      property12: 'John',
      property13: 'Doe'
    })
    expect(testVO).to.have.keys('_property12', '_property13')
  })
})

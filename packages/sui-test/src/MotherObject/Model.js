import {expect} from 'chai'
import {diffJson} from 'diff'

import {FakeGenerator} from './FakeGenerator'

class MotherObject {}

export const ModelMotherObjectFactory = Model =>
  class ModelMotherObject extends MotherObject {
    _model

    constructor({model} = {}) {
      super()
      this._model = model
      this._faker = FakeGenerator.create()
      this._expect = expect
    }

    withoutError({error} = {}) {
      expect(error).to.be.eql(null)
      return this
    }

    withError({error, klass} = {}) {
      expect(error).instanceof(klass)
      return this
    }

    isNull({json} = {}) {
      expect(json).to.be.eql(null)
    }

    get expect() {
      return this._expect
    }

    get model() {
      return this._model
    }

    get faker() {
      return this._faker
    }

    set model(nextModel) {
      this._model = nextModel
    }

    validateToJSON() {
      const originalJSON = this.jsonModel()
      const newModel = Model.create(originalJSON)
      const newJSON = newModel.toLiterals?.() ?? newModel.toJSON()
      try {
        expect(originalJSON).to.be.eql(newJSON)
      } catch (err) {
        const diff = diffJson(originalJSON, newJSON)
        console.error(
          `[ModelMotherObject#validateToJSON] has failed! ${Model.constructor?.name} doesnt follow the rule: Model.create(instance.toJSON())`
        )
        diff.forEach(part => {
          console.log(`%c ${part.value}`, `color: ${part.added ? 'green' : part.removed ? 'red' : 'grey'}`)
        })
        throw err
      }
      return this
    }

    equals({json, expected = this.jsonModel()} = {}) {
      try {
        expect(expected).to.be.eql(json)
      } catch (err) {
        console.error('There are differences between the mother object model and your model')
        const diff = diffJson(expected, json)
        diff.forEach(part => {
          console.log(`%c ${part.value}`, `color: ${part.added ? 'green' : part.removed ? 'red' : 'grey'}`)
        })
        throw err
      }
      return this
    }

    jsonModel() {
      if (!this._model) throw new Error(`[ModelMotherObject#jsonModel] model is undefined model(${this._model})`)
      return this._model.toLiterals?.() ?? this._model.toJSON()
    }
  }

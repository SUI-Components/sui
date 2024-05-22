/* eslint-disable no-undef */
import {expect} from 'chai'
import sinon from 'sinon'

import {EntryPointFactory} from '../../src/index.js'

const config = {}
const logger = {
  log: sinon.spy(),
  error: sinon.spy(),
  metric: sinon.spy()
}

describe('EntryPointFactory', () => {
  describe('without logger', () => {
    it('should be able to import a named exported UseCase', async () => {
      const useCases = {
        named_exported_single_use_case: () => import('./fixtures/NamedExportedSingleUseCase.js')
      }
      const EntryPoint = EntryPointFactory({config, useCases})
      const domain = new EntryPoint()

      const useCase = domain.get('named_exported_single_use_case')
      const response = await useCase.execute()

      expect(useCase.execute).to.be.a('function')
      expect(useCase.$).to.be.an('object')
      expect(response).to.eql(true)
    })

    it('should be able to import the whole UseCase factory', async () => {
      const useCases = {
        use_case_from_factory_with_multiple_use_cases: [
          () => import('./fixtures/factoryWithMultipleUseCases.js'),
          'useCaseOne'
        ]
      }
      const EntryPoint = EntryPointFactory({config, useCases})
      const domain = new EntryPoint()

      const useCase = domain.get('use_case_from_factory_with_multiple_use_cases')
      const response = await useCase.execute()

      expect(useCase.execute).to.be.a('function')
      expect(useCase.$).to.be.an('object')
      expect(response).to.eql(true)
    })

    it('should be able to import a single UseCase factory', async () => {
      const useCases = {
        use_case_from_single_factory_use_case: () => import('./fixtures/factoryWithSingleUseCase.js')
      }
      const EntryPoint = EntryPointFactory({config, useCases})
      const domain = new EntryPoint()

      const useCase = domain.get('use_case_from_single_factory_use_case')
      const response = await useCase.execute()

      expect(useCase.execute).to.be.a('function')
      expect(useCase.$).to.be.an('object')
      expect(response).to.eql(true)
    })

    it('should be able to subscribe to useCase execution', done => {
      const useCases = {
        use_case_from_single_factory_use_case: () => import('./fixtures/factoryWithSingleUseCase.js')
      }
      const EntryPoint = EntryPointFactory({config, useCases})
      const domain = new EntryPoint()

      domain.get('use_case_from_single_factory_use_case').subscribe(({error, result, params}) => {
        expect(error).to.be.null
        expect(params).to.deep.equal({foo: 'bar'})
        expect(result).to.be.true
        done()
      })

      domain.get('use_case_from_single_factory_use_case').execute({foo: 'bar'})
    })

    it('should be able to unsubscribe to useCase subscription', done => {
      let callCount = 0
      const useCases = {
        use_case_from_single_factory_use_case: () => import('./fixtures/factoryWithSingleUseCase.js')
      }
      const EntryPoint = EntryPointFactory({config, useCases})
      const domain = new EntryPoint()

      const {unsubscribe} = domain.get('use_case_from_single_factory_use_case').subscribe(({error, result, params}) => {
        expect(error).to.be.null
        expect(params).to.deep.equal({foo: 'bar'})
        expect(result).to.be.true
        callCount++
      })

      domain
        .get('use_case_from_single_factory_use_case')
        .execute({foo: 'bar'})
        .then(() => {
          unsubscribe()

          domain
            .get('use_case_from_single_factory_use_case')
            .execute({foo: 'bar'})
            .then(() => {
              expect(callCount).to.equal(1)
              done()
            })
            .catch(done)
        })
        .catch(done)
    })
  })
  describe('with logger', () => {
    it('should be able to import the whole UseCase factory', async () => {
      const useCases = {
        use_case_from_factory_with_multiple_use_cases_and_logger: [
          () => import('./fixtures/factoryWithMultipleUseCasesAndLogger.js'),
          'useCaseOne'
        ]
      }
      const EntryPoint = EntryPointFactory({config, useCases, logger})
      const domain = new EntryPoint()

      const useCase = domain.get('use_case_from_factory_with_multiple_use_cases_and_logger')
      const response = await useCase.execute()

      expect(useCase.execute).to.be.a('function')
      expect(useCase.$).to.be.an('object')
      expect(response).to.eql(true)
      expect(logger.log.called).to.eql(true)
      expect(logger.error.called).to.eql(true)
      expect(logger.metric.called).to.eql(true)
    })

    it('should be able to import a single UseCase factory', async () => {
      const useCases = {
        use_case_from_single_factory_use_case_and_logger: () =>
          import('./fixtures/factoryWithSingleUseCaseAndLogger.js')
      }
      const EntryPoint = EntryPointFactory({config, useCases, logger})
      const domain = new EntryPoint()

      const useCase = domain.get('use_case_from_single_factory_use_case_and_logger')
      const response = await useCase.execute()

      expect(useCase.execute).to.be.a('function')
      expect(useCase.$).to.be.an('object')
      expect(response).to.eql(true)
      expect(logger.log.called).to.eql(true)
      expect(logger.error.called).to.eql(true)
      expect(logger.metric.called).to.eql(true)
    })

    it('should be able to subscribe to useCase execution', done => {
      const useCases = {
        use_case_from_single_factory_use_case_and_logger: () =>
          import('./fixtures/factoryWithSingleUseCaseAndLogger.js')
      }
      const EntryPoint = EntryPointFactory({config, useCases, logger})
      const domain = new EntryPoint()

      domain.get('use_case_from_single_factory_use_case_and_logger').subscribe(({error, result, params}) => {
        expect(error).to.be.null
        expect(params).to.deep.equal({foo: 'bar'})
        expect(result).to.be.true
        expect(logger.log.called).to.eql(true)
        expect(logger.error.called).to.eql(true)
        expect(logger.metric.called).to.eql(true)
        done()
      })

      domain.get('use_case_from_single_factory_use_case_and_logger').execute({foo: 'bar'})
    })

    it('should be able to unsubscribe to useCase subscription', done => {
      let callCount = 0
      const useCases = {
        use_case_from_single_factory_use_case_and_logger: () =>
          import('./fixtures/factoryWithSingleUseCaseAndLogger.js')
      }
      const EntryPoint = EntryPointFactory({config, useCases, logger})
      const domain = new EntryPoint()

      const {unsubscribe} = domain
        .get('use_case_from_single_factory_use_case_and_logger')
        .subscribe(({error, result, params}) => {
          expect(error).to.be.null
          expect(params).to.deep.equal({foo: 'bar'})
          expect(result).to.be.true
          callCount++
        })

      domain
        .get('use_case_from_single_factory_use_case_and_logger')
        .execute({foo: 'bar'})
        .then(() => {
          unsubscribe()

          domain
            .get('use_case_from_single_factory_use_case_and_logger')
            .execute({foo: 'bar'})
            .then(() => {
              expect(callCount).to.equal(1)
              expect(logger.log.called).to.eql(true)
              expect(logger.error.called).to.eql(true)
              expect(logger.metric.called).to.eql(true)
              done()
            })
            .catch(done)
        })
        .catch(done)
    })
  })
})

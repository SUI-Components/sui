/* eslint-disable no-undef */
import {EntryPointFactory} from '../../src'
import {expect} from 'chai'

const config = {}

describe('EntryPointFactory', () => {
  it('should be able to import the whole UseCase factory', async () => {
    const useCases = {
      use_case_from_factory_with_multiple_use_cases: [
        () => import('./fixtures/factoryWithMultipleUseCases'),
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
      use_case_from_single_factory_use_case: () =>
        import('./fixtures/factoryWithSingleUseCase')
    }
    const EntryPoint = EntryPointFactory({config, useCases})
    const domain = new EntryPoint()

    const useCase = domain.get('use_case_from_single_factory_use_case')
    const response = await useCase.execute()

    expect(useCase.execute).to.be.a('function')
    expect(useCase.$).to.be.an('object')
    expect(response).to.eql(true)
  })
})

import {expect} from 'chai'
import DomainBuilder from '../../src/domain-builder'

describe('domainBuilder', () => {
  let mockedDomain
  beforeEach(() => {
    const fakeDomain = {
      get: () => {}
    }
    mockedDomain = DomainBuilder.extend({
      domain: fakeDomain
    })
      .mockUseCases([
        ['test_use_case', {success: 'the response'}],
        ['another_use_case', {fail: {data: {}, code: 500}}]
      ])
      .build()
  })

  it('should add mocked use cases when calling the mockUseCases fn', async () => {
    const output = await mockedDomain.get('test_use_case').execute()
    expect(output).to.equal('the response')
  })

  it('should throw failing mocked use cases', async () => {
    try {
      await mockedDomain.get('another_use_case').execute()
    } catch (rejectedData) {
      expect(rejectedData).to.deep.equal({
        data: {},
        code: 500
      })
    }
  })
})

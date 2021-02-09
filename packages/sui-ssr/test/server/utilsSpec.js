import {expect} from 'chai'
import {publicFolder, __RewireAPI__ as utilsRewireAPI} from '../../server/utils'
import {getMockedRequest, multiSiteMapping} from './fixtures'

describe('[sui-ssr] Utils', () => {
  describe('Public folder', () => {
    describe('In a multi site project', () => {
      beforeEach(() => {
        utilsRewireAPI.__Rewire__('multiSiteMapping', multiSiteMapping)
        utilsRewireAPI.__Rewire__(
          'multiSiteKeys',
          Object.keys(multiSiteMapping)
        )
        utilsRewireAPI.__Rewire__('isMultiSite', true)
      })

      afterEach(() => {
        utilsRewireAPI.__ResetDependency__('multiSiteMapping')
        utilsRewireAPI.__ResetDependency__('multiSiteKeys')
        utilsRewireAPI.__ResetDependency__('isMultiSite')
      })

      it('Should build the public folder name properly', () => {
        const folderName = publicFolder(getMockedRequest('www.bikes.com'))
        expect(folderName).to.equal('public-bikes')
      })
    })

    describe('In a single site project', () => {
      it('Should build the public folder name properly', () => {
        const folderName = publicFolder(getMockedRequest('www.bikes.com'))
        expect(folderName).to.equal('public')
      })
    })
  })
})

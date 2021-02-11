import {expect} from 'chai'
import {publicFolder} from '../../server/utils'
import {getMockedRequest} from './fixtures'
import {publicFolderWithMultiSiteConfig} from './fixtures/utils'

describe('[sui-ssr] Utils', () => {
  describe('Public folder', () => {
    describe('In a multi site project', () => {
      it('Should build the public folder name properly', () => {
        const folderName = publicFolderWithMultiSiteConfig(
          getMockedRequest('www.bikes.com')
        )
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

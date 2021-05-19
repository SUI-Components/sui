import path from 'path'
import fs from 'fs'
import {expect} from 'chai'
import {publicFolder} from '../../server/utils'
import utilsFactory from '../../server/utils/factory'
import {getMockedRequest} from './fixtures'
import {publicFolderWithMultiSiteConfig} from './fixtures/utils'
const ASYNC_CSS_ATTRS =
  'rel="stylesheet" media="only x" as="style" onload="this.media=\'all\';'
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

  describe('Create styles for', () => {
    it('Should do nothing if has no config', () => {
      const {createStylesFor} = utilsFactory({fs, path})

      const styles = createStylesFor()
      expect(styles).to.equal('')
    })

    it('Should not create styles without manifest', () => {
      const {createStylesFor} = utilsFactory({
        fs,
        path,
        config: {
          createStylesFor: {
            appStyles: 'AppStyles'
          }
        }
      })

      const styles = createStylesFor()
      expect(styles).to.equal('')
    })

    it('Should create app styles', () => {
      const {createStylesFor} = utilsFactory({
        fs,
        path,
        config: {
          assetsManifest: {
            'AppStyles.css': 'file.css'
          },
          createStylesFor: {
            appStyles: 'AppStyles'
          }
        }
      })

      const styles = createStylesFor()
      expect(styles).to.equal('<link rel="stylesheet" href="file.css" >')
    })

    it('Should create an async app styles', () => {
      const {createStylesFor} = utilsFactory({
        fs,
        path,
        config: {
          ASYNC_CSS_ATTRS,
          assetsManifest: {
            'AppStyles.css': 'file.css'
          },
          createStylesFor: {
            appStyles: 'AppStyles'
          }
        }
      })

      const styles = createStylesFor({async: true})
      expect(styles).to.equal(
        `<link rel="stylesheet" href="file.css" ${ASYNC_CSS_ATTRS}>`
      )
    })

    it('Should create page styles', () => {
      const {createStylesFor} = utilsFactory({
        fs,
        path,
        config: {
          assetsManifest: {
            'Home.css': 'home.123.css'
          },
          createStylesFor: {
            createPagesStyles: true
          }
        }
      })

      const styles = createStylesFor({pageName: 'Home'})
      expect(styles).to.equal('<link rel="stylesheet" href="home.123.css" >')
    })

    it('Should create an async page styles', () => {
      const {createStylesFor} = utilsFactory({
        fs,
        path,
        config: {
          ASYNC_CSS_ATTRS,
          assetsManifest: {
            'Home.css': 'home.css'
          },
          createStylesFor: {
            createPagesStyles: true
          }
        }
      })

      const styles = createStylesFor({pageName: 'Home', async: true})
      expect(styles).to.equal(
        `<link rel="stylesheet" href="home.css" ${ASYNC_CSS_ATTRS}>`
      )
    })

    it('Should create an async page styles and app styles', () => {
      const {createStylesFor} = utilsFactory({
        fs,
        path,
        config: {
          ASYNC_CSS_ATTRS,
          assetsManifest: {
            'AppStyles.css': 'file.css',
            'Home.css': 'home.css'
          },
          createStylesFor: {
            appStyles: 'AppStyles',
            createPagesStyles: true
          }
        }
      })

      const styles = createStylesFor({pageName: 'Home', async: true})
      expect(styles).to.equal(
        `<link rel="stylesheet" href="file.css" ${ASYNC_CSS_ATTRS}><link rel="stylesheet" href="home.css" ${ASYNC_CSS_ATTRS}>`
      )
    })
  })
})

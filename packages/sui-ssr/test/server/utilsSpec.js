import fs from 'fs'
import path from 'path'

import {expect} from 'chai'
import sinon from 'sinon'

import utilsFactory from '../../server/utils/factory.js'
import {publicFolder} from '../../server/utils/index.js'
import {getMockedRequest} from './fixtures/index.js'
import {publicFolderWithMultiSiteConfig, staticsFolderByHostWithMultiSiteConfig} from './fixtures/utils.js'

const ASYNC_CSS_ATTRS = 'rel="stylesheet" media="only x" as="style" onload="this.media=\'all\';'

describe('[sui-ssr] Utils', () => {
  describe('Public folder', () => {
    describe('In a multi site project', () => {
      it('Should build the public folder name properly', () => {
        const folderName = publicFolderWithMultiSiteConfig(getMockedRequest('www.bikes.com'))
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

  describe('Statics folder', () => {
    describe('In a multi site project', () => {
      it('Should serve the statics folder properly', () => {
        const middlewareList = {}
        const expressStaticSpy = (...args) => {
          const [folderName] = args
          const [, site] = folderName.split('-')
          middlewareList[site] = sinon.spy()

          return (...rest) => {
            return middlewareList[site](...rest)
          }
        }
        const middleware = staticsFolderByHostWithMultiSiteConfig(expressStaticSpy)
        const fakeReq = getMockedRequest('www.trucks.com')
        const fakeRes = {}
        const fakeNext = () => {}

        middleware(fakeReq, fakeRes, fakeNext)

        expect(middlewareList.trucks.calledWith(fakeReq, fakeRes, fakeNext)).to.be.true
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
        },
        assetsManifest: {}
      })

      const styles = createStylesFor()
      expect(styles).to.equal('')
    })

    it('Should create app styles', () => {
      const {createStylesFor} = utilsFactory({
        fs,
        path,
        config: {
          createStylesFor: {
            appStyles: 'AppStyles'
          }
        },
        assetsManifest: {
          'AppStyles.css': 'file.css'
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
          createStylesFor: {
            appStyles: 'AppStyles'
          }
        },
        assetsManifest: {
          'AppStyles.css': 'file.css'
        }
      })

      const styles = createStylesFor({async: true})
      expect(styles).to.equal(`<link rel="stylesheet" href="file.css" ${ASYNC_CSS_ATTRS}>`)
    })

    it('Should create page styles', () => {
      const {createStylesFor} = utilsFactory({
        fs,
        path,
        config: {
          createStylesFor: {
            createPagesStyles: true
          }
        },
        assetsManifest: {
          'Home.css': 'home.123.css'
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
          createStylesFor: {
            createPagesStyles: true
          }
        },
        assetsManifest: {
          'Home.css': 'home.css'
        }
      })

      const styles = createStylesFor({pageName: 'Home', async: true})
      expect(styles).to.equal(`<link rel="stylesheet" href="home.css" ${ASYNC_CSS_ATTRS}>`)
    })

    it('Should create an async page styles and app styles', () => {
      const {createStylesFor} = utilsFactory({
        fs,
        path,
        config: {
          ASYNC_CSS_ATTRS,
          createStylesFor: {
            appStyles: 'AppStyles',
            createPagesStyles: true
          }
        },
        assetsManifest: {
          'AppStyles.css': 'file.css',
          'Home.css': 'home.css'
        }
      })

      const styles = createStylesFor({pageName: 'Home', async: true})
      expect(styles).to.equal(
        `<link rel="stylesheet" href="file.css" ${ASYNC_CSS_ATTRS}><link rel="stylesheet" href="home.css" ${ASYNC_CSS_ATTRS}>`
      )
    })
  })
})

import {expect} from 'chai'
import {stats} from '../../src/ua-parser'
import db from './data/uaDB.json'

const test = () => {
  describe('#ua-parser.stats', () => {
    Object.keys(db).forEach(browserKey => {
      db[browserKey].forEach(uaData => {
        const {spec, ua} = uaData
        const {platform, os, browser} = spec
        it(`should detect the right ${os.name}/${browser.name}/${platform.type} device viewport`, () => {
          const uaParserStat = stats(ua)
          const isMobile = Boolean(platform.type === 'mobile')
          const isTablet = Boolean(platform.type === 'tablet')
          expect(uaParserStat.isMobile).to.equal(isMobile)
          expect(uaParserStat.isTablet).to.equal(isTablet)
        })
      })
    })
  })
}

export default test

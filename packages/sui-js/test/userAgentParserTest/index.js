import {expect} from 'chai'

import {checkLegitimateCrawler, stats} from '../../src/ua-parser/index.js'
import db from './data/uaDB.js'

const NON_CRAWLER_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0'
const CRAWLER_USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

const test = () => {
  describe('@s-ui/js', () => {
    describe('ua-parser:stats', () => {
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

    describe('ua-parser:checkLegitimateCrawler', () => {
      it('should detect crawler user agents as crawlers', async () => {
        const isCrawler = checkLegitimateCrawler(CRAWLER_USER_AGENT)
        expect(isCrawler).to.be.true
      })

      it('should not detect non-crawler user agents as crawlers', async () => {
        const isCrawler = checkLegitimateCrawler(NON_CRAWLER_USER_AGENT)
        expect(isCrawler).to.be.false
      })
    })
  })
}

export default test

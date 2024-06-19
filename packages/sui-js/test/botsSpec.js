/* eslint-env mocha */
import {expect} from 'chai'

import {checkUserAgentIsBot} from '../src/bots/index.js'

const NON_BOT_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0'
const BOT_USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

describe('@s-ui/js', () => {
  describe('bots:checkUserAgentIsBot', () => {
    it('should detect bot user agents as bots', async () => {
      const isBot = checkUserAgentIsBot(BOT_USER_AGENT)
      expect(isBot).to.be.true
    })

    it('should not detect non-bot user agents as bots', async () => {
      const isBot = checkUserAgentIsBot(NON_BOT_USER_AGENT)
      expect(isBot).to.be.false
    })
  })
})

import {expect} from 'chai'
import {HtmlBuilder} from '../../server/template'

describe('template builder', () => {
  it('should hydrate config and initial props ', () => {
    const html = HtmlBuilder.buildBody({
      bodyAttributes: false,
      bodyTplPart: '<body></body>',
      reactString: false,
      appConfig: {appConfig: 'appConfig'},
      initialProps: {initialProps: 'initialProps'},
      performance: false
    })

    expect(html).to.equal(
      '<body><script>window.__APP_CONFIG__ = JSON.parse("{\\"appConfig\\":\\"appConfig\\"}");</script><script>window.__INITIAL_PROPS__ = JSON.parse("{\\"initialProps\\":\\"initialProps\\"}");</script></body>'
    )
  })
})

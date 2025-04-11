import {expect} from 'chai'

import {HtmlBuilder} from '../../server/template/index.js'

describe('template builder', () => {
  it('should hydrate config and initial props', () => {
    const html = HtmlBuilder.buildBody({
      bodyAttributes: false,
      bodyTplPart: '<body></body>',
      reactString: false,
      appConfig: {appConfig: 'appConfig'},
      initialProps: {initialProps: 'initialProps'},
      performance: false
    })

    expect(html).to.equal(
      '<body><script>window.__APP_CONFIG__ = JSON.parse(JSON.parse(decodeURI("%22%7B%5C%22appConfig%5C%22:%5C%22appConfig%5C%22%7D%22")));</script><script>window.__INITIAL_PROPS__ = JSON.parse(JSON.parse(decodeURI("%22%7B%5C%22initialProps%5C%22:%5C%22initialProps%5C%22%7D%22")));</script><script>window.__INITIAL_CONTEXT_VALUE__ = JSON.parse(JSON.parse(decodeURI("%22%7B%7D%22")));</script></body>'
    )
  })

  it('should hydrate with initialContextValue if set', () => {
    const html = HtmlBuilder.buildBody({
      bodyAttributes: false,
      bodyTplPart: '<body></body>',
      reactString: false,
      appConfig: {appConfig: 'appConfig'},
      initialProps: {initialProps: 'initialProps'},
      performance: false,
      initialContextValue: {initialContextValue: 'initialContextValue'}
    })

    expect(html).to.equal(
      '<body><script>window.__APP_CONFIG__ = JSON.parse(JSON.parse(decodeURI("%22%7B%5C%22appConfig%5C%22:%5C%22appConfig%5C%22%7D%22")));</script><script>window.__INITIAL_PROPS__ = JSON.parse(JSON.parse(decodeURI("%22%7B%5C%22initialProps%5C%22:%5C%22initialProps%5C%22%7D%22")));</script><script>window.__INITIAL_CONTEXT_VALUE__ = JSON.parse(JSON.parse(decodeURI("%22%7B%5C%22initialContextValue%5C%22:%5C%22initialContextValue%5C%22%7D%22")));</script></body>'
    )
  })
})

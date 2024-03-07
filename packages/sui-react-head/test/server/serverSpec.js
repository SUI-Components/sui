/* eslint no-unused-expressions:0 */
/* eslint-env mocha */

import {renderToString} from 'react-dom/server'

import {expect} from 'chai'

import {descriptorsByEnvironmentPatcher} from '@s-ui/test/lib/descriptor-environment-patcher'

import Head, {HeadProvider} from '../../lib/index.js'
import {renderHeadTagsToString} from '../../lib/server.js'
descriptorsByEnvironmentPatcher()

const render = children => {
  const headTags = []
  renderToString(<HeadProvider headTags={headTags}>{children}</HeadProvider>)
  return headTags
}

describe.server('react-head on server', () => {
  describe('<Body> component', () => {
    it('renders a meta', () => {
      const headTags = render(<Head bodyAttributes={{class: 'is-test'}} />)
      expect(headTags.length).to.equal(1)

      const [{type, props}] = headTags
      expect(type).to.equal('meta')
      expect(props.class).to.equal('is-test')
    })
  })

  describe('<Html> Component ', () => {
    it('renders a meta', function () {
      const headTags = render(<Head htmlAttributes={{lang: 'es'}} />)
      expect(headTags.length).to.equal(1)

      const [{type, props}] = headTags
      expect(type).to.equal('meta')
      expect(props.lang).to.equal('es')
    })
  })

  describe('renderHeadTagsToString', () => {
    it('allows you to get extract head string and attributes for body and html using components', () => {
      const headTags = render(
        <Head bodyAttributes={{class: 'is-test'}} htmlAttributes={{lang: 'es'}}>
          <title>My awesome title</title>
          <meta name="description" content="18.014 anuncios de Viviendas en Fotocasa" />
          <meta name="theme-color" content="#303ab2" />
          <link rel="canonical" href="https://www.fotocasa.es/es" />
          <style>{'body:{background-color: red;}'}</style>
        </Head>
      )

      const {headString, bodyAttributes, htmlAttributes} = renderHeadTagsToString(headTags)

      expect(headString).to.equal(
        '<title data-rh="" data-reactroot="">My awesome title</title><meta name="description" content="18.014 anuncios de Viviendas en Fotocasa" data-rh="" data-reactroot=""/><meta name="theme-color" content="#303ab2" data-rh="" data-reactroot=""/><link data-rh="" rel="canonical" href="https://www.fotocasa.es/es" data-reactroot=""/><style data-rh="" data-reactroot="">body:{background-color: red;}</style>'
      )
      expect(htmlAttributes).to.equal('data-rh="" lang="es"')
      expect(bodyAttributes).to.equal('data-rh="" class="is-test"')
    })

    it('allows you to get extract head string and attributes for body and html using props compatible with react-helmet API', () => {
      const headTags = render(
        <Head
          bodyAttributes={{class: 'is-test'}}
          htmlAttributes={{lang: 'es'}}
          meta={[
            {
              name: 'description',
              content: '18.014 anuncios de Viviendas en Fotocasa'
            },
            {name: 'theme-color', content: '#303ab2'}
          ]}
          link={[{rel: 'canonical', href: 'https://www.fotocasa.es/es'}]}
          title="My awesome title"
        />
      )

      const {headString, bodyAttributes, htmlAttributes} = renderHeadTagsToString(headTags)

      expect(headString).to.equal(
        '<title data-rh="" data-reactroot="">My awesome title</title><meta name="description" content="18.014 anuncios de Viviendas en Fotocasa" data-rh="" data-reactroot=""/><meta name="theme-color" content="#303ab2" data-rh="" data-reactroot=""/><link data-rh="" rel="canonical" href="https://www.fotocasa.es/es" data-reactroot=""/>'
      )
      expect(htmlAttributes).to.equal('data-rh="" lang="es"')
      expect(bodyAttributes).to.equal('data-rh="" class="is-test"')
    })

    it('allows you to get extract head string and attributes for body and html using props compatible when combining APIs', () => {
      const headTags = render(
        <Head
          bodyAttributes={{class: 'is-test'}}
          htmlAttributes={{lang: 'es'}}
          meta={[
            {
              name: 'description',
              content: 'wrong description'
            },
            {name: 'theme-color', content: '#wrong-color'}
          ]}
          link={[{rel: 'canonical', href: 'https://wrong-one'}]}
          title="Dont use this one"
        >
          <title>My awesome title</title>
          <meta name="description" content="18.014 anuncios de Viviendas en Fotocasa" />
          <meta name="theme-color" content="#303ab2" />
          <link rel="canonical" href="https://www.fotocasa.es/es" />
        </Head>
      )

      const {headString, bodyAttributes, htmlAttributes} = renderHeadTagsToString(headTags)

      expect(headString).to.equal(
        '<title data-rh="" data-reactroot="">My awesome title</title><meta name="description" content="18.014 anuncios de Viviendas en Fotocasa" data-rh="" data-reactroot=""/><meta name="theme-color" content="#303ab2" data-rh="" data-reactroot=""/><link data-rh="" rel="canonical" href="https://www.fotocasa.es/es" data-reactroot=""/>'
      )
      expect(htmlAttributes).to.equal('data-rh="" lang="es"')
      expect(bodyAttributes).to.equal('data-rh="" class="is-test"')
    })
  })
})

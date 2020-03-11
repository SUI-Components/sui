import {descriptorsByEnvironmentPatcher} from '@s-ui/test/lib/descriptor-environment-patcher'
import React from 'react'
import {expect} from 'chai'
import {
  render as testingLibraryRender,
  waitForDomChange
} from '@testing-library/react'

import Head, {HeadProvider} from '../src/index'
descriptorsByEnvironmentPatcher()

const getMetaByName = name =>
  document.head.querySelector(`meta[name="${name}"]`)

const getLinkByRel = rel => document.head.querySelector(`link[rel="${rel}"]`)

const render = children => {
  testingLibraryRender(<HeadProvider>{children}</HeadProvider>)
}

describe.client('react-head on client', () => {
  describe('<Head> component', () => {
    describe('using bodyAttributes', function() {
      it('put attributes to document.body element', () => {
        render(<Head bodyAttributes={{class: 'is-test'}} />)
        expect(document.body.getAttribute('class')).to.equal('is-test')
      })
    })

    describe('title', function() {
      beforeEach(() => {
        const $title = document.querySelector('title')
        $title && $title.parentNode.removeChild($title)
        document.title = ''
      })

      it('put title element on the head with previous ssr title using children', done => {
        const title = 'My awesome title'
        const $title = document.querySelector('title')
        // simulate title is being SSR by same library
        $title.setAttribute('data-rh', '')
        $title.setAttribute('data-reactroot', '')

        // react-head should remove the previous title and add the new one
        waitForDomChange({container: document.head}).then(mutations => {
          const {addedNodes} = mutations[1]
          const [{text}] = addedNodes
          expect(text).to.equal(title)
          done()
        })

        render(
          <Head>
            <title>{title}</title>
          </Head>
        )
      })

      it('put title element on the head without previous ssr title using children', () => {
        const title = 'My awesome title'
        const $title = document.querySelector('title')
        $title.parentNode.removeChild($title)

        render(<Head title={title} />)
        expect(document.title).to.equal(title)
      })

      it('put title element on the head when combining APIs', () => {
        const title = 'My awesome title'
        const $title = document.querySelector('title')
        $title.parentNode.removeChild($title)

        render(
          <Head title="Not this one">
            <title>{title}</title>
          </Head>
        )
        expect(document.title).to.equal(title)
      })
    })
  })

  describe('<Meta> component', () => {
    it('create <meta> elements inside <head>', () => {
      render(
        <Head meta={[{name: 'meta-1', content: 'not this one'}]}>
          <meta name="meta-1" content="Awesome description" />
          <meta name="meta-2" content="viewport value" />
        </Head>
      )

      expect(getMetaByName('meta-1').getAttribute('content')).to.equal(
        'Awesome description'
      )
      expect(getMetaByName('meta-2').getAttribute('content')).to.equal(
        'viewport value'
      )
    })
  })

  describe('<Link> component', () => {
    it('create <link> elements inside <head>', () => {
      render(
        <Head link={[{rel: 'link-1', href: 'not-this-one'}]}>
          <link rel="link-1" href="awesome-link" />
          <link rel="link-2" href="awesome-value" />
        </Head>
      )

      expect(getLinkByRel('link-1').getAttribute('href')).to.equal(
        'awesome-link'
      )
      expect(getLinkByRel('link-2').getAttribute('href')).to.equal(
        'awesome-value'
      )
    })
  })

  describe('<Head> component', () => {
    it('allow to use previous react-helmet API', () => {
      render(
        <Head
          meta={[
            {
              name: 'meta-1',
              content: 'Awesome description'
            },
            {
              name: 'meta-2',
              content: 'viewport value'
            }
          ]}
          link={[
            {
              rel: 'link-1',
              href: 'awesome-link'
            },
            {
              rel: 'link-2',
              href: 'awesome-value'
            }
          ]}
        />
      )

      expect(getMetaByName('meta-1').getAttribute('content')).to.equal(
        'Awesome description'
      )
      expect(getMetaByName('meta-2').getAttribute('content')).to.equal(
        'viewport value'
      )

      expect(getLinkByRel('link-1').getAttribute('href')).to.equal(
        'awesome-link'
      )
      expect(getLinkByRel('link-2').getAttribute('href')).to.equal(
        'awesome-value'
      )
    })
  })
})

/* eslint no-unused-expressions:0 */
/* eslint-env mocha */

import {expect} from 'chai'

import Rosetta from '../src'
import Polyglot from '../src/adapters/polyglot'

// Borrowed from https://github.com/airbnb/polyglot.js/blob/master/test/main.coffee

const phrases = {
  'en-GB': {
    hello: 'Hello',
    hi_name_welcome_to_place: 'Hi, %{name}, welcome to %{place}!',
    name_your_name_is_name: '%{name}, your name is %{name}!',
    empty_string: ''
  }
}

const nestedPhrases = {
  'en-GB': {
    nav: {
      presentations: 'Presentations',
      hi_user: 'Hi, %{user}.',
      cta: {
        join_now: 'Join now!'
      }
    },
    'header.sign_in': 'Sign In'
  }
}

const pluralizePhrases = {
  'en-GB': {
    count_name: '%{smart_count} Name |||| %{smart_count} Names'
  }
}

const urlTokens = {
  'es-ES': {
    rent: 'Alquiler',
    house: 'Casa',
    elevator: 'ascensor'
  }
}

describe('I18N with polyglot adapter', () => {
  let i18n
  beforeEach(() => {
    i18n = new Rosetta({adapter: new Polyglot()})
  })
  afterEach(() => {
    i18n = null
  })

  describe('translate', () => {
    beforeEach(() => {
      i18n.languages = phrases
      i18n.culture = 'en-GB'
    })

    it('should translate a simple string', () =>
      expect(i18n.t('hello')).to.eql('Hello'))

    it('should return the key if translation not found', () =>
      expect(i18n.t('bogus_key')).to.eql('bogus_key'))

    it('should interpolate', () => {
      expect(
        i18n.t('hi_name_welcome_to_place', {name: 'Spike', place: 'the webz'})
      ).to.eql('Hi, Spike, welcome to the webz!')
    })

    it('should interpolate the same placeholder multiple times', () => {
      expect(i18n.t('name_your_name_is_name', {name: 'Spike'})).to.eql(
        'Spike, your name is Spike!'
      )
    })

    it('should allow you to supply default values', () => {
      expect(
        i18n.t('can_i_call_you_name', {
          _: 'Can I call you %{name}?',
          name: 'Robert'
        })
      ).to.eql('Can I call you Robert?')
    })

    it('should return the non-interpolated key if not initialized with allowMissing and translation not found', () => {
      expect(i18n.t('Welcome %{name}', {name: 'Robert'})).to.eql(
        'Welcome %{name}'
      )
    })

    describe('setting allowMissing', () => {
      beforeEach(() => {
        i18n.adapter.instance.allowMissing = true
      })
      afterEach(() => {
        i18n.adapter.instance.allowMissing = false
      })
      it('should return an interpolated key if initialized with allowMissing and translation not found', () => {
        expect(i18n.t('Welcome %{name}', {name: 'Robert'})).to.eql(
          'Welcome Robert'
        )
      })
    })

    it('should return the translation even if it is an empty string', () => {
      expect(i18n.t('empty_string')).to.eql('')
    })

    it('should return the default value even if it is an empty string', () => {
      expect(i18n.t('bogus_key', {_: ''})).to.eql('')
    })

    describe('nested phrase objects', () => {
      beforeEach(() => {
        i18n.languages = nestedPhrases
        i18n.culture = 'en-GB'
      })
      afterEach(() => {
        i18n.languages = phrases
        i18n.culture = 'en-GB'
      })
      it('should translate a simple string', () => {
        expect(i18n.t('nav.presentations')).to.eql('Presentations')
        expect(i18n.t('nav.hi_user', {user: 'Raph'})).to.eql('Hi, Raph.')
        expect(i18n.t('nav.cta.join_now')).to.eql('Join now!')
        expect(i18n.t('header.sign_in')).to.eql('Sign In')
      })
    })

    describe('pluralize', () => {
      beforeEach(() => {
        i18n.languages = pluralizePhrases
        i18n.culture = 'en-GB'
      })
      afterEach(() => {
        i18n.languages = phrases
        i18n.culture = ''
      })
      it('should support pluralization with an integer', () => {
        expect(i18n.t('count_name', 2)).to.eql('2 Names')
      })
    })

    describe('url', () => {
      beforeEach(() => {
        i18n.languages = urlTokens
        i18n.culture = 'es-ES'
      })
      afterEach(() => {
        i18n.languages = phrases
        i18n.culture = ''
      })

      describe('should translate url tokens', () => {
        const urlPattern = 'rent/house/marbella/elevator'
        const expectedUrl = 'alquiler/casa/marbella/ascensor'

        it('simple translation', () => {
          expect(i18n.url(urlPattern)).to.eql(expectedUrl)
        })
      })

      describe('should remove uppercase, spaces and accents', () => {
        const urlPattern = 'rent/house/Málaga Capital/elevator'
        const expectedUrl = 'alquiler/casa/malaga-capital/ascensor'

        it('dasherized and slugified', () => {
          expect(i18n.url(urlPattern)).to.eql(expectedUrl)
        })
      })

      describe('should collaspe dashes and remove accents and spaces', () => {
        const urlPattern = 'áéíóú/house/Paris-Grand --Dash/àèìòù'
        const expectedUrl = 'aeiou/casa/paris-grand-dash/aeiou'
        it('dasherized and suglified', () => {
          expect(i18n.url(urlPattern)).to.eql(expectedUrl)
        })
      })
    })
  })
})

/* eslint no-unused-expressions:0 */
/* eslint-env mocha */
import {expect} from 'chai'

import Polyglot from '../src/adapters/polyglot.js'
import Rosetta from '../src/index.js'
import {ALL_TRANSLATIONS} from './fixtures/all_translations.js'
import {LANGUAGES, LANGUAGES_WITH_SCOPES} from './fixtures/languages.js'

describe('I18N', () => {
  let i18n

  beforeEach(() => {
    i18n = new Rosetta()
  })
  afterEach(() => {
    i18n = null
  })

  it('is an instantiable class', () => {
    expect(Rosetta).to.not.be.undefined
  })

  describe('with the default adapter', () => {
    it('expect return the same key used for translate', () => {
      const key = 'That is a key'
      expect(i18n.t(key)).to.be.eql(key)
    })
  })

  describe('setting languages', () => {
    let i18n

    beforeEach(() => {
      i18n = new Rosetta({adapter: new Polyglot()})
      i18n.languages = LANGUAGES
    })
    afterEach(() => {
      i18n = null
    })

    describe('locale', () => {
      it('is "en" by default', () => {
        expect(i18n.locale).to.eql('en')
      })

      it('is changed to "es"', () => {
        i18n.culture = 'es-ES'
        expect(i18n.locale).to.eql('es')
      })
    })

    describe('culture "en-GB"', () => {
      beforeEach(() => {
        i18n.culture = 'en-GB'
      })
      afterEach(() => {
        i18n.culture = ''
      })

      it('is set properly', () => {
        expect(i18n.culture).to.eql('en-GB')
      })

      it('translates "literalOne" properly', () => {
        expect(i18n.t('literalOne')).to.eql('TranslateOneEnGB')
      })

      it('properly supports plural', () => {
        expect(i18n.t('withPlural', 1)).to.eql('one')
        expect(i18n.t('withPlural', 2)).to.eql('many')
      })

      it('formats number 10000 properly', () => {
        expect(i18n.n(10000)).to.eql('10,000')
      })

      it('formats number 1000000 properly', () => {
        expect(i18n.n(1000000)).to.eql('1,000,000')
      })

      describe('with pound sterling (GBP) as currency type', () => {
        beforeEach(() => {
          i18n.currency = 'GBP'
        })
        afterEach(() => {
          i18n.currency = ''
        })

        it('formats number 10000 properly', () => {
          expect(i18n.c(10000)).to.eql('£10,000')
        })

        it('formats number 1000000 properly', () => {
          expect(i18n.c(1000000)).to.eql('£1,000,000')
        })

        it('gets currency symbol', () => {
          expect(i18n.currencySymbol).to.eql('£')
        })
      })

      describe('with euro (EUR) as currency type', () => {
        beforeEach(() => {
          i18n.currency = 'EUR'
        })
        afterEach(() => {
          i18n.currency = ''
        })

        it('formats number 10000 properly', () => {
          expect(i18n.c(10000)).to.eql('€10,000')
        })

        it('formats number 1000000 properly', () => {
          expect(i18n.c(1000000)).to.eql('€1,000,000')
        })

        it('gets currency symbol', () => {
          expect(i18n.currencySymbol).to.eql('€')
        })
      })
    })

    describe('culture "es-ES"', () => {
      beforeEach(() => {
        i18n.culture = 'es-ES'
      })
      afterEach(() => {
        i18n.culture = ''
      })

      it('is set properly', () => {
        expect(i18n.culture).to.eql('es-ES')
      })

      it('translates "literalOne" properly', () => {
        expect(i18n.t('literalOne')).to.eql('TranslateOneEsES')
      })

      it('properly supports plural', () => {
        expect(i18n.t('withPlural', 1)).to.eql('uno')
        expect(i18n.t('withPlural', 2)).to.eql('varios')
      })

      it('modify translations "literalOne" properly', () => {
        const translations = {literalOne: 'TranslateTwoEsES'}
        i18n.addTranslations({translations})
        expect(i18n.t('literalOne')).to.eql('TranslateTwoEsES')
      })

      it('add translations "dynamicLiteral" properly', () => {
        const translations = {literalOne: 'TranslateDynamicEsES'}
        const key = 'dynamicLiteralKey'
        i18n.addTranslations({key, translations})
        expect(i18n.t(`${key}.literalOne`)).to.eql('TranslateDynamicEsES')
      })

      describe('properly formats minor types like', () => {
        describe('percentage', () => {
          it('from a non-decimal amount when ', () => {
            expect(i18n.f('percentage', 10)).to.eql('10\xa0%')
          })

          it('from a decimal amount', () => {
            expect(i18n.f('percentage', 12.34)).to.eql('12,34\xa0%')
          })

          it('from a non-decimal amount, using the formatPercentage method', () => {
            expect(i18n.formatPercentage(10)).to.eql('10\xa0%')
          })

          it('from a decimal amount, using the formatPercentage method', () => {
            expect(i18n.formatPercentage(12.34)).to.eql('12,34\xa0%')
          })
        })
        describe('phone', () => {
          it('from agglomerated digits', () => {
            expect(i18n.f('phone', '123123123')).to.eql('123 123 123')
          })

          it('from wrong spaced groups', () => {
            expect(i18n.f('phone', '1 23 12312 3')).to.eql('123 123 123')
          })

          it('with custom separator', () => {
            expect(i18n.f('phone', '123123123', {separator: '-'})).to.eql(
              '123-123-123'
            )
          })

          it('from agglomerated digits, using the formatPhone method', () => {
            expect(i18n.formatPhone('123123123')).to.eql('123 123 123')
          })

          it('from wrong spaced groups, using the formatPhone method', () => {
            expect(i18n.formatPhone('1 23 12312 3')).to.eql('123 123 123')
          })

          it('with custom separator, using the formatPhone method', () => {
            expect(i18n.formatPhone('123123123', {separator: '-'})).to.eql(
              '123-123-123'
            )
          })
        })
      })
    })
  })

  describe('available cultures "es-ES, ca-ES, en-GB"', () => {
    let i18n
    beforeEach(() => {
      i18n = new Rosetta({adapter: new Polyglot()})
      i18n.languages = LANGUAGES_WITH_SCOPES
      i18n.culture = 'es-ES'
    })
    afterEach(() => {
      i18n = null
    })

    it('returns object with translations of "literalOne" properly', () => {
      expect(i18n.getAllTranslations('SCOPE.LITERAL_ONE')).to.eql(
        ALL_TRANSLATIONS
      )
    })
  })
})

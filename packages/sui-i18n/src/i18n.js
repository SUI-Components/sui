import DefaultAdapter from './adapters/default'
import {slugify} from './slugify'

export default class Rosetta {
  constructor ({adapter = new DefaultAdapter()} = {}) {
    this._culture = null
    this._currency = null
    this._languages = null

    this.translator = adapter
  }

  set adapter (adapter) {
    this.translator = adapter
  }

  get adapter () {
    return this.translator
  }

  set culture (culture) {
    this._culture = culture
    this.translator.locale = culture.split('-')[0]
    this.translator.translations = this._languages[culture]
  }

  set currency (currency) {
    this._currency = currency
  }

  get culture () {
    return this._culture
  }

  get locale () {
    return this.translator.locale
  }

  get currency () {
    return this._currency
  }

  set languages (languages) {
    this._languages = languages
  }

  // Translate.
  t (key, values) {
    return this.translator.translate(key, values)
  }

  // Format number.
  n (number, options = {}) {
    if (typeof number !== 'number') {
      throw new Error('i18n.n should receive a number.')
    }

    return typeof Intl !== 'undefined'
      ? new Intl.NumberFormat(this._culture, options).format(number)
      : number
  }

  // Format currency number.
  c (number, minimumFractionDigits = 0) {
    return this.n(number, {
      style: 'currency',
      currency: this._currency,
      minimumFractionDigits
    })
  }

  url (urlPattern) {
    return urlPattern
      .split('/')
      .map(token => slugify(this.t(token)))
      .join('/')
  }
}

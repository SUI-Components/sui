import {slugify} from '@s-ui/js/lib/string/slugify.js'

import DefaultAdapter from './adapters/default.js'

const INTERPOLATE_REGEX = /%\[(?<key>[\S\s]*?)\b\](?<children>[\S\s]*?)\[\1\]%/gi

export default class Rosetta {
  constructor({adapter = new DefaultAdapter()} = {}) {
    this._culture = null
    this._currency = null
    this._languages = null
    this._defaultNumberFormatOptions = null

    this.translator = adapter
  }

  set adapter(adapter) {
    this.translator = adapter
  }

  get adapter() {
    return this.translator
  }

  set culture(culture) {
    this._culture = culture
    this._updateTranslator({culture})
  }

  set currency(currency) {
    this._currency = currency
  }

  // According to Intl.NumberFormat options
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options
  set defaultNumberFormatOptions(options) {
    this._defaultNumberFormatOptions = options
  }

  get culture() {
    return this._culture
  }

  get locale() {
    return this.translator.locale
  }

  get currency() {
    return this._currency
  }

  get currencySymbol() {
    const value = this.n(0, {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })

    if (typeof value !== 'string') {
      return
    }

    return value.replace(/\d/g, '').trim()
  }

  get languages() {
    return this._languages
  }

  set languages(languages) {
    this._languages = languages
  }

  // Given a culture, it refreshes the translator with the current language.
  _updateTranslator({culture}) {
    const [locale] = culture.split('-')
    const translations = this._languages[culture]
    this.translator.locale = locale
    this.translator.translations = translations
  }

  /**
   * Add new languages or modify current ones.
   *
   * @param {String} culture The culture we want to update, takes current if left empty
   * @param {String} key Key in where to store the translation, if empty, will overwrite the language
   * @param {Object} translations Translations to be added
   */
  addTranslations({culture, key, translations}) {
    const newCulture = culture || this._culture

    if (key) {
      this._languages[newCulture][key] = translations // won't work for nested keys
    } else {
      this._languages[newCulture] = translations
    }

    this._updateTranslator({culture: newCulture})
  }

  /**
   * Get all available translations for a key
   *
   * @param {String} key Key of the literal
   * @returns {Object} Object with cultures as key and literal as value
   */
  getAllTranslations(key) {
    if (!key) return {}
    return Object.fromEntries(
      Object.keys(this._languages).map(language => [
        language,
        key.split('.').reduce((level, newKey) => level[newKey], this._languages[language])
      ])
    )
  }

  // Translate.
  t(key, values) {
    return this.translator.translate(key, values)
  }

  // Format number.
  n(number, options = {}, culture) {
    if (typeof number !== 'number') {
      throw new Error('i18n.n should receive a number.')
    }

    return typeof Intl !== 'undefined'
      ? new Intl.NumberFormat(culture || this._culture, {
          ...this._defaultNumberFormatOptions,
          ...options
        }).format(number)
      : number
  }

  // Format currency number.
  c(number, minimumFractionDigits = 0, culture) {
    return this.n(
      number,
      {
        style: 'currency',
        currency: this._currency,
        minimumFractionDigits
      },
      culture
    )
  }

  /**
   * Format minor types.
   *
   * @param {String} type The kind of value to be formatted:
   *                        - percentage
   *                        - phone
   * @param {} value The value to be formatted
   * @param {Object} options Specific options for the specified type
   */
  f(type, value, options = {}) {
    if (typeof type !== 'string') throw new Error('i18n.f should receive a string as a first argument')
    if (typeof value === 'undefined') throw new Error('i18n.f should receive any value as a second argument')

    switch (type) {
      case 'percentage': {
        const {minimumFractionDigits = 0, maximumFractionDigits = 2} = options
        return this.n(value / 100, {
          style: 'percent',
          minimumFractionDigits,
          maximumFractionDigits
        })
      }
      case 'phone': {
        const {separator = ' '} = options
        return value
          .replace(/ /g, '') // reset all spaces
          .match(/.{1,3}/g) // group by chunks of 3
          .join(separator)
      }
    }

    throw new Error(`Invalid type '${type}' passed to i18n.f`)
  }

  formatPercentage(value, options) {
    return this.f('percentage', value, options)
  }

  formatPhone(phoneNumber, options) {
    return this.f('phone', phoneNumber, options)
  }

  url(urlPattern, allowQueryParams) {
    return urlPattern
      .split('/')
      .map(token => token && slugify(this.t(token), allowQueryParams))
      .join('/')
  }

  // Interpolate each text chunk, returning an array of all the transformed chunks.
  interpolate(key, values = {}) {
    // Perform basic replace for static values
    const str = this.t(key, values)

    // Identify all the occurrences which are like: %[key]children[key]%, save {key, children} in a group for every match
    // Reset the state of the regex to start from the beginning
    INTERPOLATE_REGEX.lastIndex = 0
    const matches = str.matchAll(INTERPOLATE_REGEX)

    let remaining = str

    const result = Array.from(matches).flatMap(match => {
      const occurrence = match[0]
      let {key, children} = match.groups

      // Handle nested matches
      // We need to reset the lastIndex to 0 to start the search from the beginning
      INTERPOLATE_REGEX.lastIndex = 0
      if (INTERPOLATE_REGEX.test(children)) {
        children = this.interpolate(children, values)
      }

      const option = values[key]

      // Check if there is an available replacement for each match
      const replacement = typeof option === 'function' ? option({children}) : option

      // Split the remaining string piece by the first occurence and keep the edges
      const [beforeMatch, ...afterMatch] = remaining.split(occurrence)
      remaining = afterMatch.join(occurrence)

      return [beforeMatch, replacement]
    })

    // Add potential last chunck of text.
    if (remaining.length > 0) result.push(remaining)

    // Clean falsy value and return the array of items
    return result.filter(Boolean)
  }
}

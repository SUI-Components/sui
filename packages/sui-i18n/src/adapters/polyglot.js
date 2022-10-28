//     (c) 2012 Airbnb, Inc.
//
//     polyglot.js may be freely distributed under the terms of the BSD
//     license. For all licensing information, details, and documention:
//     http://airbnb.github.com/polyglot.js
//
//
// Polyglot.js is an I18n helper library written in JavaScript, made to
// work both in the browser and in Node. It provides a simple solution for
// interpolation and pluralization, based off of Airbnb's
// experience adding I18n functionality to its Backbone.js and Node apps.
//
// Polylglot is agnostic to your translation backend. It doesn't perform any
// translation; it simply gives you a way to manage translated phrases from
// your client- or server-side JavaScript application.
//

const delimeter = '||||'

const trim = str => {
  const trimRe = /^\s+|\s+$/g
  return str.replace(trimRe, '')
}

const pluralTypes = {
  chinese: n => {
    return 0
  },
  german: n => {
    return n !== 1 ? 1 : 0
  },
  french: n => {
    return n > 1 ? 1 : 0
  },
  russian: n => {
    if (n % 10 === 1 && n % 100 !== 11) return 0
    return n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2
  },
  czech: n => {
    if (n === 1) return 0
    return n >= 2 && n <= 4 ? 1 : 2
  },
  polish: n => {
    if (n === 1) return 0
    return n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2
  },
  icelandic: n => {
    return n % 10 !== 1 || n % 100 === 11 ? 1 : 0
  }
}

// Mapping from pluralization group to individual locales.
const pluralTypeToLanguages = {
  chinese: ['fa', 'id', 'ja', 'ko', 'lo', 'ms', 'th', 'tr', 'zh'],
  german: [
    'da',
    'de',
    'en',
    'es',
    'fi',
    'el',
    'he',
    'hu',
    'it',
    'nl',
    'no',
    'pt',
    'sv'
  ],
  french: ['fr', 'tl', 'pt-br'],
  russian: ['hr', 'ru'],
  czech: ['cs'],
  polish: ['pl'],
  icelandic: ['is']
}

// ### clone
//
// Clone an object
const clone = source => {
  const ret = {}
  for (const prop in source) {
    ret[prop] = source[prop]
  }
  return ret
}

class Polyglot {
  constructor(options) {
    options = options || {}
    this.phrases = {}
    this.extend(options.phrases || {})
    this.currentLocale = options.locale || 'en'
    this.allowMissing = !!options.allowMissing
    this.VERSION = '0.4.3'
  }

  locale(newLocale) {
    if (newLocale) this.currentLocale = newLocale
    return this.currentLocale
  }

  extend(morePhrases, prefix) {
    let phrase

    for (let key in morePhrases) {
      if (morePhrases.hasOwnProperty(key)) {
        phrase = morePhrases[key]
        if (prefix) key = prefix + '.' + key
        if (typeof phrase === 'object') {
          this.extend(phrase, key)
        } else {
          this.phrases[key] = phrase
        }
      }
    }
  }

  clear() {
    this.phrases = {}
  }

  replace(newPhrases) {
    this.clear()
    this.extend(newPhrases)
  }

  t(key, options) {
    let phrase, result
    options = options == null ? {} : options
    // allow number as a pluralization shortcut
    if (typeof options === 'number') {
      options = {smart_count: options}
    }
    if (typeof this.phrases[key] === 'string') {
      phrase = this.phrases[key]
    } else if (typeof options._ === 'string') {
      phrase = options._
    } else if (this.allowMissing) {
      phrase = key
    } else {
      // eslint-disable-next-line no-console
      console.warn('Missing translation for key: "' + key + '"')
      result = key
    }
    if (typeof phrase === 'string') {
      options = clone(options)
      result = this.choosePluralForm(
        phrase,
        this.currentLocale,
        options.smart_count
      )
      result = this.interpolate(result, options)
    }
    return result
  }

  has(key) {
    return key in this.phrases
  }

  langToTypeMap(mapping) {
    let type
    let langs
    let l
    const ret = {}
    for (type in mapping) {
      if (mapping.hasOwnProperty(type)) {
        langs = mapping[type]
        for (l in langs) {
          ret[langs[l]] = type
        }
      }
    }
    return ret
  }

  choosePluralForm(text, locale, count) {
    let ret, texts, chosenText
    if (count != null && text) {
      texts = text.split(delimeter)
      chosenText = texts[this.pluralTypeIndex(locale, count)] || texts[0]
      ret = trim(chosenText)
    } else {
      ret = text
    }
    return ret
  }

  pluralTypeName(locale) {
    const langToPluralType = this.langToTypeMap(pluralTypeToLanguages)
    return langToPluralType[locale] || langToPluralType.en
  }

  pluralTypeIndex(locale, count) {
    return pluralTypes[this.pluralTypeName(locale)](count)
  }

  interpolate(phrase, options) {
    for (const arg in options) {
      if (arg !== '_' && options.hasOwnProperty(arg)) {
        phrase = phrase.replace(
          new RegExp('%\\{' + arg + '\\}', 'g'),
          options[arg]
        )
      }
    }
    return phrase
  }
}

export default class PolyglotAdapter {
  constructor() {
    this.polyglot = new Polyglot()
  }

  get instance() {
    return this.polyglot
  }

  set locale(locale) {
    return this.polyglot.locale(locale)
  }

  get locale() {
    return this.polyglot.locale()
  }

  set translations(translations) {
    this.polyglot.extend(translations)
  }

  translate(key, values) {
    return this.polyglot.t(key, values)
  }
}

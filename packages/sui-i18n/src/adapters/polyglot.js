// BSD 2-Clause License

// Copyright (c) 2012, Airbnb
// All rights reserved.

// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:

// 1. Redistributions of source code must retain the above copyright notice, this
//    list of conditions and the following disclaimer.

// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

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
  german: ['da', 'de', 'en', 'es', 'fi', 'el', 'he', 'hu', 'it', 'nl', 'no', 'pt', 'sv'],
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
      result = this.choosePluralForm(phrase, this.currentLocale, options.smart_count)
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
        phrase = phrase.replace(new RegExp('%\\{' + arg + '\\}', 'g'), options[arg])
      }
    }
    return phrase
  }
}

export default class PolyglotAdapter {
  constructor(options) {
    this.polyglot = new Polyglot(options)
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

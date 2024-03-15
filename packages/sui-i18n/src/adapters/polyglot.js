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

// eslint-disable-next-line no-console
const warn = console.warn
const defaultReplace = String.prototype.replace
const split = String.prototype.split

const trim = str => {
  const trimRe = /^\s+|\s+$/g
  return str.replace(trimRe, '')
}

// #### Pluralization methods
// The string that separates the different phrase possibilities.
const delimiter = '||||'

const russianPluralGroups = n => {
  const lastTwo = n % 100
  const end = lastTwo % 10
  if (lastTwo !== 11 && end === 1) {
    return 0
  }
  if (end >= 2 && end <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) {
    return 1
  }
  return 2
}

const defaultPluralRules = {
  // Mapping from pluralization group plural logic.
  pluralTypes: {
    arabic: n => {
      // http://www.arabeyes.org/Plural_Forms
      if (n < 3) {
        return n
      }
      const lastTwo = n % 100
      if (lastTwo >= 3 && lastTwo <= 10) return 3
      return lastTwo >= 11 ? 4 : 5
    },
    bosnian_serbian: russianPluralGroups,
    chinese: function () {
      return 0
    },
    croatian: russianPluralGroups,
    french: n => {
      return n >= 2 ? 1 : 0
    },
    german: n => {
      return n !== 1 ? 1 : 0
    },
    russian: russianPluralGroups,
    lithuanian: n => {
      if (n % 10 === 1 && n % 100 !== 11) {
        return 0
      }
      return n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 11 || n % 100 > 19) ? 1 : 2
    },
    czech: n => {
      if (n === 1) {
        return 0
      }
      return n >= 2 && n <= 4 ? 1 : 2
    },
    polish: n => {
      if (n === 1) {
        return 0
      }
      const end = n % 10
      return end >= 2 && end <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2
    },
    icelandic: n => {
      return n % 10 !== 1 || n % 100 === 11 ? 1 : 0
    },
    slovenian: n => {
      const lastTwo = n % 100
      if (lastTwo === 1) {
        return 0
      }
      if (lastTwo === 2) {
        return 1
      }
      if (lastTwo === 3 || lastTwo === 4) {
        return 2
      }
      return 3
    },
    romanian: n => {
      if (n === 1) {
        return 0
      }
      const lastTwo = n % 100
      if (n === 0 || (lastTwo >= 2 && lastTwo <= 19)) {
        return 1
      }
      return 2
    }
  },

  // Mapping from pluralization group to individual language codes/locales.
  // Will look up based on exact match, if not found and it's a locale will parse the locale
  // for language code, and if that does not exist will default to 'en'
  pluralTypeToLanguages: {
    arabic: ['ar'],
    bosnian_serbian: ['bs-Latn-BA', 'bs-Cyrl-BA', 'srl-RS', 'sr-RS'],
    chinese: ['id', 'id-ID', 'ja', 'ko', 'ko-KR', 'lo', 'ms', 'th', 'th-TH', 'zh'],
    croatian: ['hr', 'hr-HR'],
    german: [
      'fa',
      'da',
      'de',
      'en',
      'es',
      'fi',
      'el',
      'he',
      'hi-IN',
      'hu',
      'hu-HU',
      'it',
      'nl',
      'no',
      'pt',
      'sv',
      'tr'
    ],
    french: ['fr', 'tl', 'pt-br'],
    russian: ['ru', 'ru-RU'],
    lithuanian: ['lt'],
    czech: ['cs', 'cs-CZ', 'sk'],
    polish: ['pl'],
    icelandic: ['is', 'mk'],
    slovenian: ['sl-SL'],
    romanian: ['ro']
  }
}

const langToTypeMap = mapping => {
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

const pluralTypeName = (pluralRules, locale) => {
  const langToPluralType = langToTypeMap(pluralRules.pluralTypeToLanguages)
  return langToPluralType[locale] || langToPluralType[split.call(locale, /-/, 1)[0]] || langToPluralType.en
}

const pluralTypeIndex = (pluralRules, pluralType, count) => {
  return pluralRules.pluralTypes[pluralType](count)
}

const createMemoizedPluralTypeNameSelector = () => {
  const localePluralTypeStorage = {}

  return function (pluralRules, locale) {
    let pluralType = localePluralTypeStorage[locale]

    if (pluralType && !pluralRules.pluralTypes[pluralType]) {
      pluralType = null
      localePluralTypeStorage[locale] = pluralType
    }

    if (!pluralType) {
      pluralType = pluralTypeName(pluralRules, locale)

      if (pluralType) {
        localePluralTypeStorage[locale] = pluralType
      }
    }

    return pluralType
  }
}

function escape(token) {
  return token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const constructTokenRegex = opts => {
  const prefix = (opts && opts.prefix) || '%{'
  const suffix = (opts && opts.suffix) || '}'

  if (prefix === delimiter || suffix === delimiter) {
    throw new RangeError('"' + delimiter + '" token is reserved for pluralization')
  }

  return new RegExp(escape(prefix) + '(.*?)' + escape(suffix), 'g')
}

const memoizedPluralTypeName = createMemoizedPluralTypeNameSelector()

const defaultTokenRegex = /%\{(.*?)\}/g

// ### transformPhrase(phrase, substitutions, locale)
//
// Takes a phrase string and transforms it by choosing the correct
// plural form and interpolating it.
//
//     transformPhrase('Hello, %{name}!', {name: 'Spike'});
//     // "Hello, Spike!"
//
// The correct plural form is selected if substitutions.smart_count
// is set. You can pass in a number instead of an Object as `substitutions`
// as a shortcut for `smart_count`.
//
//     transformPhrase('%{smart_count} new messages |||| 1 new message', {smart_count: 1}, 'en');
//     // "1 new message"
//
//     transformPhrase('%{smart_count} new messages |||| 1 new message', {smart_count: 2}, 'en');
//     // "2 new messages"
//
//     transformPhrase('%{smart_count} new messages |||| 1 new message', 5, 'en');
//     // "5 new messages"
//
// You should pass in a third argument, the locale, to specify the correct plural type.
// It defaults to `'en'` with 2 plural forms.
const transformPhrase = (phrase, substitutions, locale, tokenRegex, pluralRules, replaceImplementation) => {
  if (typeof phrase !== 'string') {
    throw new TypeError('Polyglot.transformPhrase expects argument #1 to be string')
  }

  if (substitutions == null) {
    return phrase
  }

  let result = phrase
  const interpolationRegex = tokenRegex || defaultTokenRegex
  const replace = replaceImplementation || defaultReplace

  // allow number as a pluralization shortcut
  const options = typeof substitutions === 'number' ? {smart_count: substitutions} : substitutions

  // Select plural form: based on a phrase text that contains `n`
  // plural forms separated by `delimiter`, a `locale`, and a `substitutions.smart_count`,
  // choose the correct plural form. This is only done if `count` is set.
  if (options.smart_count != null && phrase) {
    const pluralRulesOrDefault = pluralRules || defaultPluralRules
    const texts = split.call(phrase, delimiter)
    const bestLocale = locale || 'en'
    const pluralType = memoizedPluralTypeName(pluralRulesOrDefault, bestLocale)
    const pluralTypeWithCount = pluralTypeIndex(pluralRulesOrDefault, pluralType, options.smart_count)

    result = trim(texts[pluralTypeWithCount] || texts[0])
  }

  // Interpolate: Creates a `RegExp` object for each interpolation placeholder.
  result = replace.call(result, interpolationRegex, function (expression, argument) {
    if (!options.hasOwnProperty(argument) || options[argument] == null) {
      return expression
    }
    return options[argument]
  })

  return result
}

// ### Polyglot class constructor
class Polyglot {
  constructor(options) {
    const opts = options || {}
    this.phrases = {}
    this.extend(opts.phrases || {})
    this.currentLocale = opts.locale || 'en'
    const allowMissing = opts.allowMissing ? transformPhrase : null
    this.onMissingKey = typeof opts.onMissingKey === 'function' ? opts.onMissingKey : allowMissing
    this.logMissingKey = typeof opts.logMissingKey === 'boolean' ? opts.logMissingKey : true
    this.warn = opts.warn || warn
    this.replaceImplementation = opts.replace || defaultReplace
    this.tokenRegex = constructTokenRegex(opts.interpolation)
    this.pluralRules = opts.pluralRules || defaultPluralRules
  }

  // ### polyglot.locale([locale])
  //
  // Get or set locale. Internally, Polyglot only uses locale for pluralization.
  locale(newLocale) {
    if (newLocale) this.currentLocale = newLocale
    return this.currentLocale
  }

  // ### polyglot.extend(phrases)
  //
  // Use `extend` to tell Polyglot how to translate a given key.
  //
  //     polyglot.extend({
  //       "hello": "Hello",
  //       "hello_name": "Hello, %{name}"
  //     });
  //
  // The key can be any string.  Feel free to call `extend` multiple times;
  // it will override any phrases with the same key, but leave existing phrases
  // untouched.
  //
  // It is also possible to pass nested phrase objects, which get flattened
  // into an object with the nested keys concatenated using dot notation.
  //
  //     polyglot.extend({
  //       "nav": {
  //         "hello": "Hello",
  //         "hello_name": "Hello, %{name}",
  //         "sidebar": {
  //           "welcome": "Welcome"
  //         }
  //       }
  //     });
  //
  //     console.log(polyglot.phrases);
  //     // {
  //     //   'nav.hello': 'Hello',
  //     //   'nav.hello_name': 'Hello, %{name}',
  //     //   'nav.sidebar.welcome': 'Welcome'
  //     // }
  //
  // `extend` accepts an optional second argument, `prefix`, which can be used
  // to prefix every key in the phrases object with some string, using dot
  // notation.
  //
  //     polyglot.extend({
  //       "hello": "Hello",
  //       "hello_name": "Hello, %{name}"
  //     }, "nav");
  //
  //     console.log(polyglot.phrases);
  //     // {
  //     //   'nav.hello': 'Hello',
  //     //   'nav.hello_name': 'Hello, %{name}'
  //     // }
  //
  // This feature is used internally to support nested phrase objects.
  extend(morePhrases, prefix) {
    let phrase

    for (const key in morePhrases) {
      if (morePhrases.hasOwnProperty(key)) {
        phrase = morePhrases[key]
        const prefixedKey = prefix ? prefix + '.' + key : key

        if (typeof phrase === 'object') {
          this.extend(phrase, prefixedKey)
        } else {
          this.phrases[prefixedKey] = phrase
        }
      }
    }
  }

  // ### polyglot.unset(phrases)
  // Use `unset` to selectively remove keys from a polyglot instance.
  //
  //     polyglot.unset("some_key");
  //     polyglot.unset({
  //       "hello": "Hello",
  //       "hello_name": "Hello, %{name}"
  //     });
  //
  // The unset method can take either a string (for the key), or an object hash with
  // the keys that you would like to unset.
  unset(morePhrases, prefix) {
    if (typeof morePhrases === 'string') {
      delete this.phrases[morePhrases]
    } else {
      let phrase
      for (const key in morePhrases) {
        if (morePhrases.hasOwnProperty(key)) {
          phrase = morePhrases[key]
          const prefixedKey = prefix ? prefix + '.' + key : key

          if (typeof phrase === 'object') {
            this.unset(phrase, key)
          } else {
            delete this.phrases[prefixedKey]
          }
        }
      }
    }
  }

  // ### polyglot.clear()
  //
  // Clears all phrases. Useful for special cases, such as freeing
  // up memory if you have lots of phrases but no longer need to
  // perform any translation. Also used internally by `replace`.
  clear() {
    this.phrases = {}
  }

  // ### polyglot.replace(phrases)
  //
  // Completely replace the existing phrases with a new set of phrases.
  // Normally, just use `extend` to add more phrases, but under certain
  // circumstances, you may want to make sure no old phrases are lying around.
  replace(newPhrases) {
    this.clear()
    this.extend(newPhrases)
  }

  // ### polyglot.t(key, options)
  //
  // The most-used method. Provide a key, and `t` will return the
  // phrase.
  //
  //     polyglot.t("hello");
  //     => "Hello"
  //
  // The phrase value is provided first by a call to `polyglot.extend()` or
  // `polyglot.replace()`.
  //
  // Pass in an object as the second argument to perform interpolation.
  //
  //     polyglot.t("hello_name", {name: "Spike"});
  //     => "Hello, Spike"
  //
  // If you like, you can provide a default value in case the phrase is missing.
  // Use the special option key "_" to specify a default.
  //
  //     polyglot.t("i_like_to_write_in_language", {
  //       _: "I like to write in %{language}.",
  //       language: "JavaScript"
  //     });
  //     => "I like to write in JavaScript."
  //
  t(key, options) {
    let phrase, result
    const opts = options == null ? {} : options
    if (typeof this.phrases[key] === 'string') {
      phrase = this.phrases[key]
    } else if (typeof opts._ === 'string') {
      phrase = opts._
    } else if (this.onMissingKey) {
      const onMissingKey = this.onMissingKey
      result = onMissingKey(
        key,
        opts,
        this.currentLocale,
        this.tokenRegex,
        this.pluralRules,
        this.replaceImplementation
      )
      this.logMissingKey && this.warn('Missing translation for key: "' + key + '"')
    } else {
      this.logMissingKey && this.warn('Missing translation for key: "' + key + '"')
      result = key
    }
    if (typeof phrase === 'string') {
      result = transformPhrase(
        phrase,
        opts,
        this.currentLocale,
        this.tokenRegex,
        this.pluralRules,
        this.replaceImplementation
      )
    }
    return result
  }

  // ### polyglot.has(key)
  //
  // Check if polyglot has a translation for given key
  has(key) {
    return this.phrases.hasOwnProperty(key)
  }

  // export transformPhrase
  transformPhrase(phrase, substitutions, locale) {
    return transformPhrase(phrase, substitutions, locale)
  }
}

export default class PolyglotAdapter {
  constructor(options) {
    const opts = options || {}
    this.polyglot = new Polyglot(opts)
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

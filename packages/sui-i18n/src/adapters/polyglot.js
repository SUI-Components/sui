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

// the string that separates the different phrase possibilities
const delimeter = '||||'

// trims a string
const trim = str => {
  const trimRe = /^\s+|\s+$/g
  return str.replace(trimRe, '')
}

// mapping from pluralization group plural logic
const pluralTypes = {
  chinese: function (n) {
    return 0
  },
  german: function (n) {
    return n !== 1 ? 1 : 0
  },
  french: function (n) {
    return n > 1 ? 1 : 0
  },
  russian: function (n) {
    if (n % 10 === 1 && n % 100 !== 11) return 0
    return n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2
  },
  czech: function (n) {
    if (n === 1) return 0
    return n >= 2 && n <= 4 ? 1 : 2
  },
  polish: function (n) {
    if (n === 1) return 0
    return n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2
  },
  icelandic: function (n) {
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

  // check if polyglot has a translation for given key
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

  // based on a phrase text that contains `n` plural forms separated
  // by `delimeter`, a `locale`, and a `count`, choose the correct
  // plural form, or none if `count` is `null`.
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

  // ### interpolate
  //
  // Does the dirty work. Creates a `RegExp` object for each
  // interpolation placeholder.
  interpolate(phrase, options) {
    for (const arg in options) {
      if (arg !== '_' && options.hasOwnProperty(arg)) {
        // We create a new `RegExp` each time instead of using a more-efficient
        // string replace so that the same argument can be replaced multiple times
        // in the same phrase.
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

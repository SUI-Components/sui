import {warn} from '../console.js'

// #### Pluralization methods
// The string that separates the different phrase possibilities
const delimeter = '||||'

// Mapping from pluralization group plural logic
const pluralTypes = {
  german: n => (n !== 1 ? 1 : 0),
  french: n => (n > 1 ? 1 : 0)
}

// Mapping from pluralization group to individual locales
const pluralTypeToLanguages = {
  german: ['de', 'en', 'es', 'it', 'pt'],
  french: ['fr', 'tl', 'pt-br']
}

function langToTypeMap(mapping) {
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

function pluralTypeName(locale) {
  const langToPluralType = langToTypeMap(pluralTypeToLanguages)
  return langToPluralType[locale] || langToPluralType.en
}

export default class PolyglotAdapter {
  constructor(options = {}) {
    this.phrases = {}
    this.extend(options.phrases || {})
    this.currentLocale = options.locale || 'en'
    this.allowMissing = !!options.allowMissing
    this.warn = options.warn || warn
  }

  #pluralTypeIndex(locale, count) {
    return pluralTypes[pluralTypeName(locale)](count)
  }

  // ### interpolate
  //
  // Does the dirty work. Creates a `RegExp` object for each
  // interpolation placeholder.
  #interpolate(phrase, options) {
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

  // Based on a phrase text that contains `n` plural forms separated
  // by `delimeter`, a `locale`, and a `count`, choose the correct
  // plural form, or none if `count` is `null`.
  #choosePluralForm(text, locale, count) {
    let ret, texts, chosenText
    if (count != null && text) {
      texts = text.split(delimeter)
      chosenText = texts[this.#pluralTypeIndex(locale, count)] || texts[0]
      ret = chosenText.trim()
    } else {
      ret = text
    }
    return ret
  }

  // ### polyglot.locale([locale])
  //
  // Get or set locale. Internally, Polyglot only uses locale for pluralization.
  set locale(newLocale) {
    this.currentLocale = newLocale
  }

  get locale() {
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
  // ### polyglot.clear()
  //
  // Clears all phrases. Useful for special cases, such as freeing
  // up memory if you have lots of phrases but no longer need to
  // perform any translation. Also used internally by `replace`.
  unset(morePhrases, prefix) {
    let phrase

    if (typeof morePhrases === 'string') {
      delete this.phrases[morePhrases]
    } else {
      for (let key in morePhrases) {
        if (morePhrases.hasOwnProperty(key)) {
          phrase = morePhrases[key]
          if (prefix) key = prefix + '.' + key
          if (typeof phrase === 'object') {
            this.unset(phrase, key)
          } else {
            delete this.phrases[key]
          }
        }
      }
    }
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
      this.warn('Missing translation for key: "' + key + '"')
      result = key
    }
    if (typeof phrase === 'string') {
      options = {...options}
      result = this.#choosePluralForm(
        phrase,
        this.currentLocale,
        options.smart_count
      )
      result = this.#interpolate(result, options)
    }
    return result
  }

  // ### polyglot.has(key)
  //
  // Check if polyglot has a translation for given key
  has(key) {
    return key in this.phrases
  }

  get instance() {
    return this
  }

  set translations(translations) {
    this.extend(translations)
  }

  translate(key, values) {
    return this.t(key, values)
  }
}

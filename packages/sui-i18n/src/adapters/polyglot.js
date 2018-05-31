import Polyglot from 'node-polyglot'

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

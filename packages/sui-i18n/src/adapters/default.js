/* eslint no-unused-expressions:0 */
import {warn} from '../console'

export default class DefaultAdapter {
  get instance() {
    warn()
  }

  set locale(locale) {
    // warn('DefaultAdapter#setLocale', locale);
  }

  set translations(translations) {
    // warn('DefaultAdapter#setTranslations', translations);
  }

  translate(key, values) {
    warn(undefined, key, values)
    return key
  }
}

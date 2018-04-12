import Rosetta from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'

const DEFAULT_CULTURE = 'es-ES'
const DEFAULT_CURRENCY = 'EUR'

const initRosseta = (literals, config = {}) => {
  const i18n = new Rosetta({adapter: new Polyglot()})
  i18n.languages = literals
  i18n.culture = config.culture || DEFAULT_CULTURE
  i18n.currency = config.currency || DEFAULT_CURRENCY

  return i18n
}

export default ({literalsUseCase, dictionary, config}) =>
  literalsUseCase
    ? literalsUseCase.execute().then(literals => initRosseta(literals, config))
    : new Promise(resolve => resolve(initRosseta(dictionary, config)))

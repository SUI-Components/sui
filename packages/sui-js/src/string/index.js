import toQueryString from './to-query-string'

export {default as parseQueryString} from './parse-query-string'
export {default as toQueryString} from './to-query-string'
export const fromArrayToCommaQueryString = query =>
  decodeURIComponent(toQueryString(query, {arrayFormat: 'comma'}))

export {fromSnakeToCamelCase, fromCamelToSnakeCase} from './snake-case'
export {has as hasAccents, remove as removeAccents} from 'remove-accents'

export {default as toCamelCase} from 'lodash.camelcase'
export {default as toCapitalCase} from 'lodash.capitalize'
export {default as toKebabCase} from 'lodash.kebabcase'

export {getRandomString} from './random-string'
export {slugify} from './slugify'

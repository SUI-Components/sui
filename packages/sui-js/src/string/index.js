import {stringify} from 'qs'

export {default as parseQueryString} from './parse-query-string'
export const fromArrayToCommaQueryString = query =>
  decodeURIComponent(stringify(query, {arrayFormat: 'comma'}))

export {stringify as toQueryString} from 'qs'
export {fromSnakeToCamelCase, fromCamelToSnakeCase} from './snake-case'
export {has as hasAccents, remove as removeAccents} from 'remove-accents'

export {default as toCamelCase} from 'lodash.camelcase'
export {default as toCapitalCase} from 'lodash.capitalize'
export {default as toKebabCase} from 'lodash.kebabcase'

export {getRandomString} from './random-string'
export {slugify} from './slugify'

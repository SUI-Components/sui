import toQueryString from './to-query-string'

export {default as parseQueryString} from './parse-query-string'
export {default as toQueryString} from './to-query-string'

/**
 * @deprecated since version 2.9.0
 * will be deleted in version 3
 *
 * use toQueryString(queryParams, {arrayFormat: 'comma'}) instead
 * it may not be very convenient to decode with decodeURIComponent knowing that it will be used in the url
 */
export const fromArrayToCommaQueryString = query =>
  decodeURIComponent(toQueryString(query, {arrayFormat: 'comma'}))

export {fromSnakeToCamelCase, fromCamelToSnakeCase} from './snake-case'
export {has as hasAccents, remove as removeAccents} from 'remove-accents'

export {default as toCamelCase} from 'just-camel-case'
export {default as toCapitalCase} from 'just-capitalize'
export {default as toKebabCase} from 'just-kebab-case'

export {getRandomString} from './random-string'
export {slugify} from './slugify'

export {highlightText} from './highlighter'

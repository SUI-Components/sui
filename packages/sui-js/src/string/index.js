import queryString from 'query-string'
export {fromSnakeToCamelCase, fromCamelToSnakeCase} from './snake-case'
export {has as hasAccents, remove as removeAccents} from 'remove-accents'
export {default as toKebabCase} from 'lodash.kebabcase'

const parse = data => queryString.parse(data)
const stringify = data => queryString.stringify(data)

export const queryStringUtility = {
  parse,
  stringify
}

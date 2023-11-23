export const fromSnakeToCamelCase = string => string.replace(/(_\w)/g, m => m[1].toUpperCase())
export const fromCamelToSnakeCase = string => string.replace(/([A-Z])/g, s => '_' + s.toLowerCase())

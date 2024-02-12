export {config} from './config.js'

export const MAIN_ENTRY_POINT = './app'

export const cleanList = list => list.filter(Boolean)

export const when = (check, getValue) => (check ? getValue() : false)

export const envVars = (env = []) =>
  env.reduce(
    (acc, variable) => {
      if (Array.isArray(variable)) {
        const [key, value] = variable
        acc[key] = process.env[key] || value
      } else {
        acc[variable] = process.env[variable] || false
      }
      return acc
    },
    {NODE_ENV: 'development', DEBUG: false}
  )

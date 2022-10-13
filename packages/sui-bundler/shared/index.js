const {config} = require('./config.js')

exports.MAIN_ENTRY_POINT = './app.js'
exports.config = config

exports.cleanList = list => list.filter(Boolean)

exports.when = (check, getValue) => (check ? getValue() : false)

exports.envVars = (env = []) =>
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

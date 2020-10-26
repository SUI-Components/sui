const path = require('path')

const {PWD} = process.env

module.exports = alias =>
  alias
    ? Object.entries(alias).reduce(
        (obj, [aliasName, aliasPath]) => ({
          ...obj,
          [aliasName]: aliasPath.startsWith('./')
            ? path.join(PWD, aliasPath)
            : aliasPath
        }),
        {}
      )
    : {}

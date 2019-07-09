const path = require('path')

module.exports = alias =>
  alias
    ? Object.entries(alias).reduce(
        (obj, [aliasName, aliasPath]) => ({
          ...obj,
          [aliasName]: aliasPath.startsWith('./')
            ? path.join(process.env.PWD, aliasPath)
            : aliasPath
        }),
        {}
      )
    : {}

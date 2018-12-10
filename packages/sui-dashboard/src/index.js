const fg = require('fast-glob')

const flat = arr => [].concat(...arr)

module.exports.stats = ({repositories, root}) => {
  const suiComponents = fg
    .sync([
      `${root}/sui-components/components/**/package.json`,
      '!**/node_modules/**'
    ])
    .map(path => require(path).name)

  const componentsInstalled = flat(
    repositories.map(repo => [
      `${root}/${repo}/node_modules/@s-ui/*`,
      `${root}/${repo}/node_modules/@schibstedspain/*`
    ])
  )

  const dirs = fg.sync(componentsInstalled, {onlyDirectories: true})
  const stats = suiComponents.reduce((acc, component) => {
    acc[component] = dirs
      .filter(dir => dir.includes(component))
      .map(dir =>
        dir.replace(
          /tmp\/\d+\/(?<repo>[a-z|-]+)\/.*/,
          '$<repo>'.replace('/', '')
        )
      )
      .map(repo => repo.replace('/', ''))
    return acc
  }, {})
  debugger // eslint-disable-line
  console.log(stats)
}

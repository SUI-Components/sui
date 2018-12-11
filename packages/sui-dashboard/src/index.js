const GoogleSpreadsheet = require('google-spreadsheet')
const fg = require('fast-glob')
const {promisify} = require('util')

const flat = arr => [].concat(...arr)

module.exports.stats = async ({repositories, root, dry}) => {
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
  const statsSUIComponentUsedInProjects = suiComponents.reduce(
    (acc, component) => {
      acc[component] = dirs
        .filter(dir => dir.includes(component))
        .map(dir => dir.replace(/tmp\/\d+\/(?<repo>[a-z|-]+)\/.*/, '$<repo>'))
        .map(repo => repo.replace('/', ''))
      return acc
    },
    {}
  )

  const statsSUIComponentUsedByProjects = repositories.reduce((acc, repo) => {
    acc[repo] = dirs
      .filter(dir => dir.includes(repo))
      .filter(dir => suiComponents.some(sui => dir.includes(sui)))
      .map(dir => dir.replace(/^.+(?<comp>@[a-z|-]+\/[a-z|-]+$)/, '$<comp>'))
    return acc
  }, {})
  console.log({
    statsSUIComponentUsedInProjects,
    statsSUIComponentUsedByProjects
  })
}

module.exports.excel = async ({
  statsSUIComponentUsedByProjects,
  statsSUIComponentUsedInProjects
}) => {
  const doc = new GoogleSpreadsheet(
    '1ClA-1wmFFG97fvQZHmSz_6Py_CWkqpFlJOHxXbx9hqM'
  )
  await promisify(doc.useServiceAccountAuth)(
    require('../sui-components-dashboard-9350df448fcd.json')
  )
  const info = await promisify(doc.getInfo)()
  console.log(info)
}

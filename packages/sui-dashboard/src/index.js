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
        .map(dir =>
          dir.replace(root, '').replace(/(?<repo>[a-z|-]+)\/.*/, '$<repo>')
        )
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

  const partialStats = {
    statsSUIComponentUsedInProjects,
    statsSUIComponentUsedByProjects,
    suiStats: {
      totalSUIComponents: Object.keys(statsSUIComponentUsedInProjects).length,
      totalReusedSUIComponents: Object.values(
        statsSUIComponentUsedInProjects
      ).reduce((acc, list) => (acc += list.length), 0),
      maxPossible:
        Object.keys(statsSUIComponentUsedInProjects).length *
        repositories.length
    }
  }

  return {
    ...partialStats,
    suiStats: {
      ...partialStats.suiStats,
      percentage:
        Math.ceil(
          (partialStats.suiStats.totalSUIComponents * 100) /
            partialStats.suiStats.maxPossible
        ) + '%'
    }
  }
}

// Dead code, but I dont want to remove
module.exports.excel = async ({
  statsSUIComponentUsedByProjects,
  statsSUIComponentUsedInProjects
}) => {
  const doc = new GoogleSpreadsheet(
    '1ClA-1wmFFG97fvQZHmSz_6Py_CWkqpFlJOHxXbx9hqM'
  )
  // Promises for president
  const useServiceAccountAuth = promisify(doc.useServiceAccountAuth)
  const getInfo = promisify(doc.getInfo)
  const getRows = promisify(doc.getRows)
  const getCells = promisify(doc.getCells)

  await useServiceAccountAuth(
    require('../sui-components-dashboard-9350df448fcd.json')
  )
  const spreadsheet = await getInfo()
  const suiComponentWorksheetID = spreadsheet.worksheets.find(
    w => w.title === 'SUIComponents in projects'
  ).id

  const rows = await getRows(suiComponentWorksheetID)
  const cells = await getCells(suiComponentWorksheetID)

  console.log(rows, cells)
}

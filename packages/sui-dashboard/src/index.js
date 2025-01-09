import {readFileSync} from 'fs'
import {createRequire} from 'module'

import fg from 'fast-glob'

const require = createRequire(import.meta.url)

const flat = arr => [].concat(...arr)

const getPackageContent = filepath => JSON.parse(readFileSync(filepath))

export async function stats({repositories, root, getVersions = false}) {
  const suiComponents = fg
    .sync([`${root}/sui-components/components/**/package.json`, '!**/node_modules/**'])
    .map(path => require(path).name)

  const componentsInstalled = flat(
    repositories.map(repo => [`${root}/${repo}/node_modules/@s-ui/*`, `${root}/${repo}/node_modules/@schibstedspain/*`])
  )

  const dirs = fg.sync(componentsInstalled, {onlyDirectories: true})

  const statsSUIComponentUsedInProjects = suiComponents.reduce((acc, component) => {
    acc[component] = dirs
      .filter(dir => dir.includes(component))
      .map(dir => {
        const pkg = getVersions && getPackageContent(`${dir}/package.json`)
        return dir
          .replace(root, '')
          .replace(/(?<repo>[a-z|-]+)\/.*/, '$<repo>' + (getVersions ? ` – v${pkg.version}` : ''))
      })
    return acc
  }, {})

  const statsSUIComponentUsedByProjects = repositories.reduce((acc, repo) => {
    acc[repo] = dirs
      .filter(dir => dir.includes(repo))
      .filter(dir => suiComponents.some(sui => dir.includes(sui)))
      .map(dir => {
        const pkg = getVersions && getPackageContent(`${dir}/package.json`)
        return dir.replace(/^.+(?<comp>@[a-z|-]+\/[a-z|-]+$)/, '$<comp>' + (getVersions ? `@${pkg.version}` : ''))
      })
    return acc
  }, {})

  const totalSUIComponents = Object.keys(statsSUIComponentUsedInProjects).length
  const totalReusedSUIComponents = Object.values(statsSUIComponentUsedInProjects).reduce(
    (acc, list) => (acc += list.length),
    0
  )
  const maxPossible = totalSUIComponents * repositories.length

  return {
    statsSUIComponentUsedByProjects,
    statsSUIComponentUsedInProjects,
    suiStats: {
      percentage: Math.ceil((totalReusedSUIComponents * 100) / maxPossible) + '%',
      totalSUIComponents,
      totalReusedSUIComponents,
      maxPossible
    }
  }
}

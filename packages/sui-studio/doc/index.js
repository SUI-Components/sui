// /^\.\/\w+\/index\.jsx?/
var libContext = require.context('./', true, /^\.\/\w+\/index\.jsx?/)
const importAll = requireContext => requireContext.keys().map(requireContext)
const storeAll = requireContext => {
  const allModules = importAll(requireContext)
  const allKeys = (requireContext => requireContext.keys())(requireContext)
  return allKeys.map((key, index) => {
    const defaultModule = allModules[index].default
    const otherModules = Object.keys(allModules[index])
      .map(allModulesKey =>
        allModulesKey !== 'default'
          ? [allModulesKey, allModules[index][allModulesKey]]
          : null
      )
      .filter(value => value != null)
    const displayName = defaultModule.displayName || key.split('/')[1]
    return [displayName, defaultModule, Object.fromEntries(otherModules)]
  })
}

const DOCElements = storeAll(libContext)

let lib = {}

DOCElements.forEach(([name, module, extras]) => {
  lib[name] = module
  Object.keys(extras).forEach(extraKey => {
    lib[name][extraKey] = extras[extraKey]
  })
})

export default lib

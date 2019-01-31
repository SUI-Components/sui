const createMatchTransformer = linkedPackagePath => match => {
  // we have to detect if the last char is a quote or /lib to add the correct suffix
  const suffix = match[match.length - 1] === "'" ? "'" : '/lib'
  return `${linkedPackagePath}${suffix}`
}

function linkLoader(source) {
  // extract all the packages that we want to link
  const {entryPoints: packagesToLink} = this.query
  // pass the code through a reduce to change the import of the package
  // with the absolute path of the linked one
  return Object.keys(packagesToLink).reduce((modifiedSource, pkg) => {
    // create a regex for detecting if the package is used in the source
    // we have to check if it ends with quote (normal import)
    // or with /lib, as we might be importing a submodule of a package
    const regex = new RegExp(`${pkg}(\\/lib|')`, 'g')
    // create a function that will be used when match ocurred
    const transformMatch = createMatchTransformer(packagesToLink[pkg])
    // replace all the uses of the package by using the function
    return modifiedSource.replace(regex, transformMatch)
  }, source)
}

module.exports = linkLoader

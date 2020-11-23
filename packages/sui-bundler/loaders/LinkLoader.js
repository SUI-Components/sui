const LIB_PATH = '/lib'

const createMatchTransformer = linkedPackagePath => match => {
  // we have to detect if the last char is a quote or /lib to add the correct suffix
  const suffix = match[match.length - 1] === "'" ? "'" : LIB_PATH
  return `${linkedPackagePath}${suffix}`.replace('/src/lib', '/src')
}

function linkLoader(source) {
  const isSCSS = this.request.includes('.scss')
  // extract all the packages that we want to link
  const {entryPoints: packagesToLink} = this.query
  // pass the code through a reduce to change the import of the package
  // with the absolute path of the linked one
  return Object.keys(packagesToLink).reduce((modifiedSource, pkg) => {
    // Webpack use ~ to resolve scss files from node_modules
    // we need to remove the symbol for scss files as well
    const prefix = isSCSS ? '~' : ''
    // create a regex for detecting if the package is used in the source
    // we have to check if it ends with quote (normal import)
    // or with /lib, as we might be importing a submodule of a package
    const regex = new RegExp(`${prefix}${pkg}(\\${LIB_PATH}|')`, 'g')
    // create a function that will be used when match ocurred
    const transformMatch = createMatchTransformer(packagesToLink[pkg])
    // replace all the uses of the package by using the function
    return modifiedSource.replace(regex, transformMatch)
  }, source)
}

module.exports = linkLoader

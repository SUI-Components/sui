module.exports = function(packagesToTest, moduleToRequire) {
  // check if the param is an array, if not, convert to it
  packagesToTest = Array.isArray(packagesToTest)
    ? packagesToTest
    : [packagesToTest]
  // we only need to check if one package is installed of all the list
  const isInstalled = packagesToTest.some(pkg => {
    try {
      require(pkg)
      return true
    } catch (e) {
      return false
    }
  })

  return isInstalled ? require(moduleToRequire) : isInstalled
}

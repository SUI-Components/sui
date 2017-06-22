module.exports = function (base, module) {
  var isInstall = false
  try {
    require(base)
    isInstall = true
  } catch (e) {}

  return isInstall ? require(module) : isInstall
}

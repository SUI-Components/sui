const colors = require('colors')
// List of test describers to be patched.
const functionsToPatch = ['describe', 'describe.only', 'it', 'it.only']
// List of environments, the environment define the function name. describe.client, describe.server
const environments = {
  CLIENT: 'client',
  SERVER: 'server'
}

const isNode =
  typeof process === 'object' && process.toString() === '[object process]'

export const descriptorsByEnvironmentPatcher = function descriptorsByEnvironmentPatcher() {
  /**
   * This function is the one with the purpose of handle and return the function that should be attached to our runOn{client | server} patch.
   * @param {Object} descriptor Is the object that contains the name of the descriptor base function and in the cases that we have nested function calls the nested name too
   * @param {String} env Can be one of the constants defined in the environments object - {SERVER, CLIENT}
   * @param {Boolean} isOnly A boolean function to know if we are trying to run a descriptor with the .only Function
   */
  function buildFunctionForEnv({descriptorName, firstLevelFnName, env}) {
    const shouldReturnDescriber =
      (isNode && env === environments.SERVER) ||
      (!isNode && env === environments.CLIENT)
    const isOnlyServerButRunningAsClient =
      !isNode && env === environments.SERVER && firstLevelFnName
    const isOnlyClientButRunningAsServer =
      isNode && env === environments.CLIENT && firstLevelFnName
    if (shouldReturnDescriber) {
      return function() {
        firstLevelFnName
          ? global[descriptorName][firstLevelFnName](...arguments)
          : global[descriptorName](...arguments)
      }
    } else if (
      isOnlyClientButRunningAsServer ||
      isOnlyServerButRunningAsClient
    ) {
      return () => {
        throw new Error(
          colors.red(
            `Seems that you are doing a ${descriptorName}.${env}.only but you are running the tests for the ${
              isNode ? environments.SERVER : environments.CLIENT
            }\n\n`
          )
        )
      }
    } else {
      return title =>
        console.warn(
          colors.yellow(
            `skiping on the ${
              isNode ? environments.SERVER : environments.CLIENT
            } '${descriptorName}('${title}')\n`
          )
        )
    }
  }

  /**
   * The patchChainedFunction is the function that will handle to call the buildFunctionForEnv iterating for the environments to attach the function to each one
   * @param {Array} An array of two elements composed for the baseFnName (usually describe, it....) and a first depth level method (usually .only)
   */
  function patchChainedFunction([descriptorName, firstLevelFnName]) {
    const baseFn = global[descriptorName]
    const environmentsKeys = Object.keys(environments)

    environmentsKeys.forEach(key => {
      const env = environments[key]
      baseFn[`${env}`][firstLevelFnName] = buildFunctionForEnv({
        descriptorName,
        firstLevelFnName,
        env
      })
    })
  }

  /**
   * Patch base functions will
   * @param {String} descriptorName is a string with the name of the function to be patched.
   */
  function patchBaseFunctions(descriptorName) {
    const environmentsKeys = Object.keys(environments)

    environmentsKeys.forEach(key => {
      const env = environments[key]
      global[descriptorName][`${env}`] = buildFunctionForEnv({
        descriptorName,
        env
      })
    })
  }

  /**
   * patchFunction is the entry method that will handle with the logic to know if is a depth descriptor patch or a baseDescriptor patch. Regarding on that will call one or another patching function
   * @param {String} fnName is a string with the name of the function to be patched.
   */
  function patchFunction(fnName) {
    const functionChainNames = fnName.split('.')
    const isOnly = functionChainNames.length > 1
    isOnly
      ? patchChainedFunction(functionChainNames)
      : patchBaseFunctions(fnName)
  }

  // Init of our patcher.
  functionsToPatch.forEach(fnName => patchFunction(fnName))
}

try {
  const {writeFile} = require('@s-ui/helpers/file')
  const {name: suiLintPackageName} = require('../package.json')

  const {CI, INIT_CWD} = process.env

  if (CI) {
    console.log('CI detected, skipping @s-ui/lint postinstall')
    process.exit(0)
  }

  const ACTUAL_PACKAGE_PATH = `${INIT_CWD}/package.json`
  const LINT_CONFIGS_PATH = './node_modules/@s-ui/lint/'
  const LINT_CONFIGS = {
    eslintConfig: {
      extends: [`${LINT_CONFIGS_PATH}eslintrc.js`]
    },
    prettier: `${LINT_CONFIGS_PATH}.prettierrc.js`,
    stylelint: {
      extends: `${LINT_CONFIGS_PATH}stylelint.config.js`
    }
  }

  // get the actual package.json file
  const packageJSON = require(ACTUAL_PACKAGE_PATH)

  // extract the fields we want to compare
  const {eslintConfig, name, prettier, stylelint} = packageJSON

  // if actual package is the same, avoid the op
  // this is useful when linking the package
  if (name === suiLintPackageName) {
    process.exit(0)
  }

  // check if actual package has different lint config
  const areDifferentLintConfig =
    JSON.stringify({eslintConfig, prettier, stylelint}) !==
    JSON.stringify(LINT_CONFIGS)

  // if they're different, we're going to rewrite the package.json
  if (areDifferentLintConfig) {
    console.log('Adding @s-ui/lint config to package.json...')
    // remove deprecated linter config of sasslintConfig
    const {sasslintConfig, ...originalPackageJSON} = packageJSON
    // create the new package.json object to be written
    const newPackageJSON = {
      ...originalPackageJSON,
      ...LINT_CONFIGS
    }
    // write the new package.json with the linter conifg
    writeFile(
      ACTUAL_PACKAGE_PATH,
      JSON.stringify(newPackageJSON, null, 2)
    ).then(() => console.log('Added @s-ui/lint config successfully'))
  } else {
    console.log('@s-ui/lint config already in your package.json. Great!')
  }
} catch (e) {
  console.log("@s-ui/lint can't update package.json file.")
}

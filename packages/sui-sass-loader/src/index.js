// @ts-check

const path = require('path')
const fs = require('fs-extra')
const crypto = require('crypto')
const preview = require('cli-source-preview')
const co = require('co')
const loaderUtils = require('loader-utils')

const replaceAsync = require('./replace.js')
const Cache = require('./cache.js')
const utils = require('./utils.js')

const BOM_HEADER = '\uFEFF'
const EXT_PRECEDENCE = ['.scss', '.css']
const MATCH_URL_ALL = /url\(\s*(['"]?)([^ '"()]+)(\1)\s*\)/g
const MATCH_IMPORTS =
  /@import\s+(['"])([^,;'"]+)(\1)(\s*,\s*(['"])([^,;'"]+)(\1))*\s*;/g
const MATCH_USES =
  /@use\s+(['"])([^,;'"]+)(\1)(\s*,\s*(['"])([^,;'"]+)(\1))*\s*;/g
const MATCH_FILES = /(['"])([^,;'"]+)(\1)/g

/**
 * Get imports to resolve
 * @param {string} original Original path to resolve
 * @param {Array<string>} includePaths
 * @param {Object} transformers
 * @returns {Array<string>} Return array of possible import files to resolve
 */
function getImportsToResolve(original, includePaths, transformers) {
  /**
   * We're fixing when the import to a node_modules is not using the ~ symbol at the beggining
   * In order to keep it retrocompatible, we're matching the packages starting with a @
   * like @s-ui/icons, and then adding the ~ as needed.
   */
  if (original.startsWith('@')) {
    original = `~${original}`
  }

  const extname = path.extname(original)
  let basename = path.basename(original, extname)
  const dirname = path.dirname(original)

  // this code seems safe to be removed
  // is module import
  // if ((original.startsWith('~')) && (dirname === '.' || !dirname.includes('/'))) {
  //   return [original]
  // }

  const imports = []
  let names = [basename]
  let exts = [extname]
  const extensionPrecedence = [...EXT_PRECEDENCE, ...Object.keys(transformers)]

  if (!extname) {
    exts = extensionPrecedence
  }

  if (extname && !extensionPrecedence.includes(extname)) {
    basename = path.basename(original)
    names = [basename]
    exts = extensionPrecedence
  }

  if (basename[0] !== '_') {
    names.push('_' + basename)
  }

  names.forEach(name => {
    exts.forEach(ext => {
      const file = name + ext
      const filePath = path.join(dirname, file)
      // search relative to original file
      imports.push(filePath)
      // search in includePaths
      for (const includePath of includePaths) {
        imports.push(path.join(includePath, filePath))
      }
    })
  })

  return [
    ...imports,
    path.join(dirname, `${basename}/index.scss`),
    path.join(dirname, `${basename}/_index.scss`)
  ]
}

function createTransformersMap(transformers) {
  if (!transformers) return {}

  // return map of extension strings to transformer functions
  return transformers.reduce((extensionMap, transformer) => {
    transformer.extensions.forEach(ext => {
      extensionMap[ext] = transformer.transform
    })
    return extensionMap
  }, {})
}

/**
 * Transform relative paths to absolute paths
 * @param {object} params
 * @param {string} params.baseUrl
 * @param {Array<string>} params.paths - paths to transform
 * @return {Array<string>} List of transformed path
 */
const transformRelativeToAbsolutePaths = ({baseUrl, paths}) => {
  return paths.map(currentPath =>
    path.isAbsolute(currentPath) ? currentPath : path.join(baseUrl, currentPath)
  )
}

/**
 * Extract Webpack config from loader context
 * @param {object} ctx
 * @returns {{alias: { [x: string]: string}, modules: Array<string>}}
 */
const getWebpackConfig = ctx => {
  const {_compilation: compilation} = ctx
  const {resolve = {}} = compilation.options
  const {alias = {}, modules = ['node_modules']} = resolve
  return {alias, modules}
}

function getLoaderConfig(ctx) {
  const defaults = {
    includePaths: [],
    data: '',
    transformers: [],
    resolveURLs: true,
    sassOptions: {}
  }

  const options = utils.mergeDeep(defaults, ctx.getOptions() || {})
  const {
    data,
    includePaths,
    implementation = require('sass'),
    resolveURLs,
    root,
    sassOptions,
    transformers
  } = options

  const basedir =
    ctx.rootContext || options.context || ctx.options.context || process.cwd()

  // get webpack config from context ctx
  const {alias, modules} = getWebpackConfig(ctx)

  return {
    alias,
    basedir,
    baseEntryDir: path.dirname(ctx.resourcePath),
    data,
    implementation,
    includePaths: transformRelativeToAbsolutePaths({
      paths: includePaths,
      baseUrl: basedir
    }),
    modules,
    resolveURLs,
    root,
    sassOptions,
    transformers: createTransformersMap(transformers)
  }
}

function* mergeSources(
  opts,
  entry,
  resolve,
  dependencies = [],
  level = 0,
  uses
) {
  const {alias, includePaths, modules, transformers, sassOptions = {}} = opts
  const {importer} = sassOptions
  let content

  if (typeof entry === 'object') {
    content = entry.content
    entry = entry.file
  } else {
    content = yield fs.readFile(entry, 'utf8')

    // fix BOM issue (only on windows)
    if (content.startsWith(BOM_HEADER)) {
      content = content.substring(BOM_HEADER.length)
    }
  }

  const ext = path.extname(entry)

  if (transformers[ext]) {
    content = transformers[ext](content)
  }

  const entryDir = path.dirname(entry)

  // replace url(...)
  if (opts.resolveURLs) {
    content = content.replace(MATCH_URL_ALL, (total, left, file, right) => {
      if (!file.startsWith('.')) return total

      if (loaderUtils.isUrlRequest(file)) {
        // handle url(<loader>!<file>)
        const pos = file.lastIndexOf('!')
        if (pos >= 0) {
          left += file.substring(0, pos + 1)
          file = file.substring(pos + 1)
        }

        // test again
        if (loaderUtils.isUrlRequest(file)) {
          const absoluteFile = path.normalize(path.resolve(entryDir, file))
          let relativeFile = path
            .relative(opts.baseEntryDir, absoluteFile)
            .replace(/\\/g, '/') // fix for windows path

          if (relativeFile[0] !== '.') {
            relativeFile = './' + relativeFile
          }

          return `url(${left}${relativeFile}${right})`
        } else {
          return total
        }
      } else {
        return total
      }
    })
  }

  let settingsNameSpaceReplace

  content = content.replace(MATCH_USES, total => {
    // we only put sass helpers once
    if (total.includes('sass:')) {
      if (!uses.includes(total)) uses.push(total)
      return ''
    }
    // we check if it's a file to include it correctly
    if (total.includes('settings')) {
      // we generate a random hash for the namespace of the settings
      // so we could have same @use of different settings files
      // we add a `s` at the beggining to ensure is a valid variable name
      const hash = `s${crypto.randomBytes(20).toString('hex')}`
      settingsNameSpaceReplace = hash
      uses.push(`@use '${path.join(entryDir, 'settings.scss')}' as ${hash};`)
      return ''
    }
    // default empty string
    return ''
  })

  if (settingsNameSpaceReplace) {
    content = content.replaceAll('settings', settingsNameSpaceReplace)
  }

  // find comments should after content.replace(...), otherwise the comments offset will be incorrect
  const commentRanges = utils.findComments(content)

  // replace @import "..."
  function* importReplacer(total) {
    // if current import is in comments, then skip it
    const range = this
    const finded = commentRanges.find(commentRange => {
      return range.start >= commentRange[0] && range.end <= commentRange[1]
    })

    if (finded) return total

    const contents = []
    let matched

    // must reset lastIndex
    MATCH_FILES.lastIndex = 0

    while ((matched = MATCH_FILES.exec(total))) {
      // eslint-disable-line
      const originalImport = matched[2].trim()
      if (!originalImport) {
        const err = new Error(
          `import file cannot be empty: "${total}" @${entry}`
        )

        err.file = entry

        throw err
      }

      const imports = getImportsToResolve(
        originalImport,
        includePaths,
        transformers
      )

      let resolvedImport

      /* Check resolve.alias Webpack config to check if
         the import path is an alias and we don't need
         to do nothing more to resolve it.
      */
      const resolveImportUsingAlias = ({importFile}) => {
        return Object.entries(alias).some(([alias, path]) => {
          if (!importFile.startsWith(alias)) return

          const file = importFile.replace(alias, path)
          // check if using the alias we could resolve the file
          if (fs.existsSync(file)) {
            resolvedImport = file
            return true
          }
        })
      }

      /* Check resolve.modules in order to change
         the import file path to the module path
      */
      const resolveImportUsingModules = ({importFile}) => {
        return modules.some(module => {
          const fullPath = path.join(module, importFile)
          if (fs.existsSync(fullPath)) {
            resolvedImport = fullPath
            return true
          }
        })
      }

      for (let i = 0; i < imports.length; i++) {
        const importFile = imports[i]

        if (resolveImportUsingAlias({importFile})) break
        if (resolveImportUsingModules({importFile})) break

        const reqFile = loaderUtils.urlToRequest(importFile, opts.root)
        const tmp = importer ? importer(reqFile) : {}

        // if importFile is absolute path, then use it directly
        if (path.isAbsolute(importFile) && fs.existsSync(importFile)) {
          resolvedImport = importFile
        } else if (tmp?.file) {
          try {
            resolvedImport = tmp.file
            break
          } catch {} // skip
        } else {
          try {
            const reqFile = loaderUtils.urlToRequest(importFile, opts.root)
            resolvedImport = yield resolve(entryDir, reqFile)
            break
          } catch {} // skip
        }
      }

      if (!resolvedImport) {
        const err = new Error(
          `import file cannot be resolved: "${total}" @${entry}`
        )

        err.file = entry

        throw err
      }

      resolvedImport = path.normalize(resolvedImport)

      if (!dependencies.includes(resolvedImport)) {
        dependencies.push(resolvedImport)

        contents.push(
          yield mergeSources(
            opts,
            resolvedImport,
            resolve,
            dependencies,
            level + 1,
            uses
          )
        )
      }
    }

    return contents.join('\n')
  }

  return yield replaceAsync(content, MATCH_IMPORTS, co.wrap(importReplacer))
}

module.exports = function (content) {
  const entry = this.resourcePath
  const callback = this.async()
  const cache = new Cache(entry)
  const options = getLoaderConfig(this)
  const ctx = this

  const resolver = ctx => (dir, importFile) =>
    new Promise((resolve, reject) => {
      ctx.resolve(dir, importFile, (err, resolvedFile) => {
        err ? reject(err) : resolve(resolvedFile)
      })
    })

  const appendUses = (content, uses) => uses.join('') + content

  return co(function* () {
    const dependencies = []
    const uses = []

    if (cache.isValid()) {
      cache.getDependencies().forEach(file => {
        ctx.dependency(file)
      })

      return cache.read()
    } else {
      if (options.data) {
        content = options.data + '\n' + content
      }

      const merged = appendUses(
        yield mergeSources(
          options,
          {
            file: entry,
            content
          },
          resolver(ctx),
          dependencies,
          0,
          uses
        ),
        uses
      )

      dependencies.forEach(file => ctx.dependency(file))

      try {
        const result = yield new Promise((resolve, reject) => {
          const sassOptions = utils.mergeDeep(options.sassOptions, {
            indentedSyntax: entry.endsWith('.sass'),
            file: entry,
            data: merged
          })

          options.implementation.render(sassOptions, (err, result) => {
            err ? reject(err) : resolve(result)
          })
        })

        const css = result.css.toString()

        cache.write(dependencies, css)

        return css
      } catch (err) {
        console.log(
          preview(merged, err, {
            offset: 10
          })
        )
        console.error(err.stack || err)

        throw err
      }
    }
  }).then(
    css => {
      callback(null, css)
    },
    err => {
      // disabled cache
      cache.markInvalid()

      // add error file as deps, so if file changed next time sass-loader will be noticed
      err.file && ctx.dependency(err.file)

      callback(err)
    }
  )
}

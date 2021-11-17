// @ts-check

const path = require('path')
const fs = require('fs-extra')
const preview = require('cli-source-preview')
const co = require('co')
const loaderUtils = require('loader-utils')

const replaceAsync = require('./replace')
const Cache = require('./cache')
const utils = require('./utils')

const BOM_HEADER = '\uFEFF'
const EXT_PRECEDENCE = ['.scss', '.sass', '.css']
const MATCH_URL_ALL = /url\(\s*(['"]?)([^ '"()]+)(\1)\s*\)/g
const MATCH_IMPORTS = /@import\s+(['"])([^,;'"]+)(\1)(\s*,\s*(['"])([^,;'"]+)(\1))*\s*;/g
const MATCH_USES = /@use\s+(['"])([^,;'"]+)(\1)(\s*,\s*(['"])([^,;'"]+)(\1))*\s*;/g
const MATCH_FILES = /(['"])([^,;'"]+)(\1)/g

function getImportsToResolve(original, includePaths, transformers) {
  const extname = path.extname(original)
  let basename = path.basename(original, extname)
  const dirname = path.dirname(original)

  // is module import
  if (original.startsWith('~') && (dirname === '.' || !dirname.includes('/'))) {
    return [original]
  }

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

  for (let i = 0; i < names.length; i++) {
    for (let j = 0; j < exts.length; j++) {
      // search relative to original file
      imports.push(path.join(dirname, names[i] + exts[j]))

      // search in includePaths
      for (const includePath of includePaths) {
        imports.push(path.join(includePath, dirname, names[i] + exts[j]))
      }
    }
  }

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

function getLoaderConfig(ctx) {
  const defaults = {
    includePaths: [],
    data: '',
    transformers: [],
    resolveURLs: true,
    sassOptions: {}
  }

  const options = utils.mergeDeep(defaults, ctx.getOptions() || {})
  const includePaths = options.includePaths
  const basedir =
    ctx.rootContext || options.context || ctx.options.context || process.cwd()
  const transformers = createTransformersMap(options.transformers)
  const implementation = options.implementation || require('sass')

  // convert relative to absolute
  for (let i = 0; i < includePaths.length; i++) {
    if (!path.isAbsolute(includePaths[i])) {
      includePaths[i] = path.join(basedir, includePaths[i])
    }
  }

  return {
    basedir,
    includePaths,
    transformers,
    implementation,
    baseEntryDir: path.dirname(ctx.resourcePath),
    root: options.root,
    data: options.data,
    resolveURLs: options.resolveURLs,
    sassOptions: options.sassOptions
  }
}

function* mergeSources(opts, entry, resolve, dependencies, level, uses) {
  level = level || 0
  dependencies = dependencies || []

  const {includePaths, transformers, sassOptions = {}} = opts
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

  content = content.replace(MATCH_USES, total => {
    if (!uses.includes(total)) uses.push(total)
    return ''
  })

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

      for (let i = 0; i < imports.length; i++) {
        const reqFile = loaderUtils.urlToRequest(imports[i], opts.root)
        const tmp = importer ? importer(reqFile) : {}

        // if imports[i] is absolute path, then use it directly
        if (path.isAbsolute(imports[i]) && fs.existsSync(imports[i])) {
          resolvedImport = imports[i]
        } else if (tmp?.file) {
          try {
            resolvedImport = tmp.file
            break
          } catch (err) {
            // skip
          }
        } else {
          try {
            const reqFile = loaderUtils.urlToRequest(imports[i], opts.root)
            resolvedImport = yield resolve(entryDir, reqFile)
            break
          } catch (err) {
            // skip
          }
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

      if (dependencies.indexOf(resolvedImport) < 0) {
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

module.exports = function(content) {
  const entry = this.resourcePath
  const callback = this.async()
  const cache = new Cache(entry)
  const options = getLoaderConfig(this)
  const ctx = this

  function resolver(ctx) {
    return function(dir, importFile) {
      return new Promise((resolve, reject) => {
        ctx.resolve(dir, importFile, (err, resolvedFile) => {
          err ? reject(err) : resolve(resolvedFile)
        })
      })
    }
  }

  function appendUses(content, uses) {
    return uses.join('') + content
  }

  return co(function*() {
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
            content: content
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
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
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

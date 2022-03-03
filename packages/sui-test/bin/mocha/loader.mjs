import {compileSource} from '@s-ui/js-compiler'

const supportedModuleFormats = ['module', 'commonjs']

const shouldUseLoader = url => !/node_modules/.test(url) && !/node:/.test(url)

export async function load(url, context, defaultLoad) {
  if (url.includes('mocha/bin/mocha')) return {format: 'commonjs'}

  if (!shouldUseLoader(url)) return defaultLoad(url, context, defaultLoad)

  const {source, format} = await defaultLoad(url, context, defaultLoad)
  // NodeJS' implementation of defaultLoad returns a source of `null` for CommonJS modules.
  // So we just skip compilation when it's commonjs until a future day when NodeJS (might) support that.
  // Also, we skip compilation of wasm and json modules by babel, since babel isn't needed or possible in those situations
  if (!source || (format && !supportedModuleFormats.includes(format))) {
    return {source, format}
  }

  const {code} = await compileSource(source.toString())
  const transformedCode = code
    .replace('react/jsx-runtime', 'react/jsx-runtime.js')
    .replace('react-dom/server', 'react-dom/server.js')

  return {
    format: 'module',
    source: transformedCode
  }
}

import fg from 'fast-glob'
import {compileAndOutputFile} from './index.js'

console.time('[sui-js-compiler]')
const files = await fg('./src/**/*.{js,jsx}')
files.forEach(compileAndOutputFile)
console.timeEnd('[sui-js-compiler]')

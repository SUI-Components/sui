import {transform, transformFile} from '@swc/core'
import fs from 'fs-extra'
import defaultConfig from './swc-config.js'

export const compileFile = file => transformFile(file, defaultConfig)
export const compileSource = source => transform(source, defaultConfig)

export const compileAndOutputFile = async file => {
  const {code} = await compileFile(file)
  const outputPath = file.replace('./src', './lib')
  fs.outputFile(outputPath, code)
}

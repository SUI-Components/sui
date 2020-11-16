#!/usr/bin/env node
/* eslint-disable no-console */

const MAX_BUFFER = 1024 * 1024
const COMPONENTS_PATH = './components'
const NEW_COMPONENTS_PATH = './tmpComponents'
const DEMO_PATH = './demo'
const NEW_DEMO_PATH = './tmpDemo'
const TEST_PATH = './test'
const NEW_TEST_PATH = './tmpTest'
const {NO_COMPONENTS_MESSAGE} = require('../config')

const log = console.log
const error = console.error
const {exec} = require('child_process')
const fs = require('fs-extra')

function getComponentsList(stdout) {
  const COMMIT_MESSAGE_PATTERN = /(?<context>[a-zA-Z]+)\/(?<component>[a-zA-Z]+)/
  const list = []

  stdout.split('\n').forEach(line => {
    const data = line.match(COMMIT_MESSAGE_PATTERN)
    if (!data) return
    const [component] = data
    if (!list.includes(component)) list.push(component)
  })

  return list
}

async function cleanComponents(list) {
  list.forEach(async component => {
    const componentsSrc = `${COMPONENTS_PATH}/${component}/`
    const componentsDest = `${NEW_COMPONENTS_PATH}/${component}/`
    const demoSrc = `${DEMO_PATH}/${component}/`
    const demoDest = `${NEW_DEMO_PATH}/${component}/`
    const tmpSrc = `${TEST_PATH}/${component}/`
    const tmpDest = `${NEW_TEST_PATH}/${component}/`

    try {
      await fs.move(componentsSrc, componentsDest)
      await fs.move(demoSrc, demoDest)
      if (fs.existsSync(tmpSrc)) await fs.move(tmpSrc, tmpDest)
    } catch (err) {
      error(err)
    }
  })

  try {
    await fs.move(
      `${COMPONENTS_PATH}/README.md`,
      `${NEW_COMPONENTS_PATH}/README.md`
    )
    await fs.move(`${DEMO_PATH}/package.json`, `${NEW_DEMO_PATH}/package.json`)
    await fs.remove(COMPONENTS_PATH)
    await fs.remove(DEMO_PATH)
    await fs.remove(TEST_PATH)
    fs.renameSync(NEW_COMPONENTS_PATH, COMPONENTS_PATH)
    fs.renameSync(NEW_DEMO_PATH, DEMO_PATH)
    if (fs.existsSync(NEW_TEST_PATH)) fs.renameSync(NEW_TEST_PATH, TEST_PATH)
  } catch (err) {
    error(err)
  }
}

exec('git cherry -v master', {maxBuffer: MAX_BUFFER}, (err, stdout) => {
  if (err) error(err)
  const componentsList = getComponentsList(stdout)
  if (componentsList.length < 1) {
    log(NO_COMPONENTS_MESSAGE)
    process.exit(0)
  }
  cleanComponents(componentsList)
})

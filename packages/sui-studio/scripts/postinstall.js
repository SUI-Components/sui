const fse = require('fs-extra')
const fg = require('fast-glob')

console.log(`Looking for test folder in ${process.env.INIT_CWD}`)

if (fse.existsSync(`${process.env.INIT_CWD}/test`)) {
  console.log('Test folder in place')
  process.exit(0)
}
console.log(`Generating test folder in ${process.env.INIT_CWD}`)

const components = fg
  .sync([
    `${process.env.INIT_CWD}/components/**/src/index.js`,
    '!**/node_modules/**'
  ])
  .map(path =>
    path
      .replace(process.env.INIT_CWD + '/components/', '')
      .replace('/src/index.js', '')
  )

const showError = msg => {
  console.error(msg)
  process.exit(1)
}

const writeFile = async (path, body) => {
  return fse
    .outputFile(path, body)
    .then(() => {
      console.log(`Modified ${path}`)
    })
    .catch(() => {
      showError(`Fail modifying ${path}`)
    })
}

const createDir = path => {
  return fse
    .mkdirp(path)
    .then(() => {
      console.log(`Created ${path}`)
    })
    .catch(() => {
      showError(`Fail creating ${path}`)
    })
}

const BODY_TEST = `/**
 * Remember: YOUR COMPONENT IS DEFINE GLOBALLY
 * */

/* eslint react/jsx-no-undef:0 */

// import React from 'react'
// import {render} from '@testing-library/react'

import chai, {expect} from 'chai'
import chaiDOM from 'chai-dom'

chai.use(chaiDOM)

describe('AtomButton', () => {
  it('Render', () => {
    // Example TO BE DELETED!!!!
    // const {getByRole} = render(<AtomButton>HOLA</AtomButton>)
    // expect(getByRole('button')).to.have.text('HOLA')
    expect(true).to.be.eql(false)
  })
})`

Promise.all(
  components.map(component =>
    createDir(`${process.env.INIT_CWD}/test/${component}`)
  )
).then(
  components.map(component =>
    writeFile(`${process.env.INIT_CWD}/test/${component}/index.js`, BODY_TEST)
  )
)

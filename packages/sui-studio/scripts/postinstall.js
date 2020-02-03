const fse = require('fs-extra')
const fg = require('fast-glob')

const CWD = process.env.INIT_CWD
console.log(`Looking for test folder in ${CWD}`)

if (fse.existsSync(`${CWD}/test`)) {
  console.log('Test folder in place')
}
console.log(`Generating test folder in ${CWD}`)

const components = fg
  .sync([`${CWD}/components/**/src/index.js`, '!**/node_modules/**'])
  .map(path =>
    path.replace(CWD + '/components/', '').replace('/src/index.js', '')
  )

const showError = msg => {
  console.error(msg)
}

const writeFile = (path, body) => {
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

const BODY_TEST = component => `/*
 * Remember: YOUR COMPONENT IS DEFINED GLOBALLY
 * */

/* eslint react/jsx-no-undef:0 */

// import React from 'react'
// import {render} from '@testing-library/react'

import chai, {expect} from 'chai'
import chaiDOM from 'chai-dom'

chai.use(chaiDOM)

describe('${component}', () => {
  it('Render', () => {
    // Example TO BE DELETED!!!!
    // const {getByRole} = render(<AtomButton>HOLA</AtomButton>)
    // expect(getByRole('button')).to.have.text('HOLA')
    expect(true).to.be.eql(false)
  })
})`

Promise.all(
  components.map(component => createDir(`${CWD}/test/${component}`))
).then(
  components.map(component =>
    writeFile(`${CWD}/test/${component}/index.js`, BODY_TEST(component))
  )
)

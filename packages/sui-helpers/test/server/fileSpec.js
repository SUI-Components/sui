import filesystem from 'fs'

import {expect} from 'chai'

import {removeFile, writeFile} from '../../file.js'

const fs = filesystem.promises
const pathOfFile = `${__dirname}/a.txt`

describe('[sui-helpers] file.js utils', () => {
  describe('writeFile', () => {
    it('creates a file correctly from scratch', async () => {
      await writeFile(pathOfFile, 'johndoe')
      const contentOfFile = await fs.readFile(pathOfFile, 'utf8')
      expect(contentOfFile).to.equal('johndoe')
    })

    it('overwrite a file correctly with new content', async () => {
      await writeFile(pathOfFile, 'mariadoe')
      const contentOfFile = await fs.readFile(pathOfFile, 'utf8')
      expect(contentOfFile).to.equal('mariadoe')
    })
  })

  describe('removeFile', () => {
    it('remove a file if it exists', async () => {
      await removeFile(pathOfFile)
      const fileExists = await fs.access(pathOfFile).catch(() => false)
      expect(fileExists).to.be.false
    })

    it('if file does not exist, silently does nothing', async () => {
      await removeFile(pathOfFile)
    })
  })
})

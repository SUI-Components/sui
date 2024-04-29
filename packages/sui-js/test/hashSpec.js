/* eslint-env mocha */
import {expect} from 'chai'

import {createAsyncSha256} from '../src/hash/index.js'

describe('@s-ui/js', () => {
  describe('string:sha256', () => {
    it('should hash a specific string to something known', async () => {
      const hashedString = await createAsyncSha256('abc')
      expect(hashedString).to.equal('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
    })
    it('should hash a specific email string to something known', async () => {
      const hashedString = await createAsyncSha256('firstname.lastname@example.com')
      expect(hashedString).to.equal('4a0a303e33c11f496a9312a77309133325af1527a26d9d95cf74b81feba9c955')
    })
    it('should hash a specific unicode string to something known', async () => {
      const hashedString = await createAsyncSha256('Barça')
      expect(hashedString).to.equal('d7bbc6d46128ea3a0fe95c744899f7724ce15600e3e6bf2d93bc319b1252cd9b')
    })
  })
})

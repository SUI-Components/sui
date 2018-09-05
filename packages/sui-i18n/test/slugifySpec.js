/* eslint no-unused-expressions:0 */
/* eslint-env mocha */
import {expect} from 'chai'

import {slugify} from '../src/slugify'

describe('I18N', () => {
  describe('Given a string with leters and numbers', () => {
    it('string must remain without changes', () => {
      const inputString = 'helloworld98765432'
      expect(slugify(inputString)).to.be.equal('helloworld98765432')
    })

    it('string must be substituted by dashes', () => {
      const inputString = 'hello world 98765432'
      expect(slugify(inputString)).to.be.equal('hello-world-98765432')
    })

    it('undesired chars must be removed', () => {
      const inputString = 'hello$world%&/()"··98765432'
      expect(slugify(inputString)).to.be.equal('helloworld98765432')
    })

    it('dots must remain in the string', () => {
      const inputString = 'hello-world.php'
      expect(slugify(inputString)).to.be.equal('hello-world.php')
    })

    it('underscore must be removed', () => {
      const inputString = 'hello_world.php'
      expect(slugify(inputString)).to.be.equal('helloworld.php')
    })
  })
})

import {transformAsync as transform} from '@babel/core'
import {expect} from 'chai'

const babelConfig = {
  presets: [require.resolve('../../src/index.js')]
}

const babel = source => transform(source, babelConfig)

describe('babel-preset-sui', function() {
  // first time babel is called is pretty slow
  // and could be worse than 2s
  this.timeout(10000)

  describe('regarding React', () => {
    it('should support and use JSX Runtime', async () => {
      const jsx = 'const App = () => <h1>Hello World</h1>'

      const {code} = await babel(jsx)

      expect(code).to.include('_jsx("h1"')
      expect(code).to.include('react/jsx-runtime')
    })

    it('should remove prop-types', async () => {
      const jsx = `
        import PropTypes from 'prop-types'
        const App = (msg) => <h1>Hello World</h1>
        App.propTypes = { msg: PropTypes.string }
      `

      const {code} = await babel(jsx)

      console.log(code)

      expect(code).to.not.include('App.propTypes')
    })
  })

  describe('regarding JavaScript', () => {
    it('support all class properties', async () => {
      const source = `
      class className {
        static staticField = true
        #privateField = 0
        publicField = 1
      }
      `

      const {code} = await babel(source)

      expect(code).to.include('_privateField')
      expect(code).to.include('publicField')
      expect(code).to.include('staticField')
    })
  })
})

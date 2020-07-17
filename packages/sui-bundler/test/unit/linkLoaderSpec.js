const {expect} = require('chai')

const linkLoader = require('../../loaders/LinkLoader')
const sassLinkLoader = require('../../loaders/sassLinkLoader')

describe('LinkLoader', () => {
  it('Should rewrite the source code for JS files in the root', async () => {
    const nextSource = linkLoader.call(
      {
        query: {
          entryPoints: {
            '@s-ui/module': '/User/Developer/sui/module/src'
          }
        }
      },
      "require('@s-ui/module')"
    )

    expect(nextSource).to.be.eql("require('/User/Developer/sui/module/src')")
  })

  it('Should rewrite the source code for JS files for a deeper route', async () => {
    const nextSource = linkLoader.call(
      {
        query: {
          entryPoints: {
            '@s-ui/module': '/User/Developer/sui/module/src'
          }
        }
      },
      "require('@s-ui/module/lib/level/mod.js')"
    )

    expect(nextSource).to.be.eql(
      "require('/User/Developer/sui/module/src/level/mod.js')"
    )
  })

  it('Should rewrite the source code for SASS files in the root', async () => {
    const nextSource = sassLinkLoader({
      '@s-ui/module': '/User/Developer/sui/module/src'
    })('~@s-ui/module/lib/index.scss')

    expect(nextSource.file).to.be.eql(
      '/User/Developer/sui/module/src/index.scss'
    )
  })
})

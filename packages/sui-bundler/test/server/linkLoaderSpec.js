const {expect} = require('chai')

const linkLoader = require('../../loaders/LinkLoader.js')

describe('LinkLoader', () => {
  it('Single quotes: Should rewrite the source code for JS files in the root', async () => {
    const nextSource = linkLoader.call(
      {
        query: {
          entryPoints: {
            '@s-ui/module': '/User/Developer/sui/module/src'
          }
        },
        request: 'file.js'
      },
      "require('@s-ui/module')"
    )

    expect(nextSource).to.be.eql("require('/User/Developer/sui/module/src')")
  })

  it('Double quotes: Should rewrite the source code for JS files in the root', async () => {
    const nextSource = linkLoader.call(
      {
        query: {
          entryPoints: {
            '@s-ui/module': '/User/Developer/sui/module/src'
          }
        },
        request: 'file.js'
      },
      'require("@s-ui/module")'
    )

    expect(nextSource).to.be.eql('require("/User/Developer/sui/module/src")')
  })

  it('Single quotes: Should rewrite the source code for JS files for a deeper route', async () => {
    const nextSource = linkLoader.call(
      {
        query: {
          entryPoints: {
            '@s-ui/module': '/User/Developer/sui/module/src'
          }
        },
        request: 'file.js'
      },
      "require('@s-ui/module/lib/level/mod.js')"
    )

    expect(nextSource).to.be.eql(
      "require('/User/Developer/sui/module/src/level/mod.js')"
    )
  })

  it('Double quotes: Should rewrite the source code for JS files for a deeper route', async () => {
    const nextSource = linkLoader.call(
      {
        query: {
          entryPoints: {
            '@s-ui/module': '/User/Developer/sui/module/src'
          }
        },
        request: 'file.js'
      },
      'require("@s-ui/module/lib/level/mod.js")'
    )

    expect(nextSource).to.be.eql(
      'require("/User/Developer/sui/module/src/level/mod.js")'
    )
  })

  it('Single quotes: Should rewrite the source code for SASS files in the root', async () => {
    const nextSource = linkLoader.call(
      {
        query: {
          entryPoints: {
            '@s-ui/module': '/User/Developer/sui/module/src'
          }
        },
        request: 'file.scss'
      },
      '@import "~@s-ui/module/lib/index";'
    )

    expect(nextSource).to.be.eql(
      '@import "/User/Developer/sui/module/src/index";'
    )
  })

  it('Double quotes: Should rewrite the source code for SASS files in the root', async () => {
    const nextSource = linkLoader.call(
      {
        query: {
          entryPoints: {
            '@s-ui/module': '/User/Developer/sui/module/src'
          }
        },
        request: 'file.scss'
      },
      "@import '~@s-ui/module/lib/index';"
    )

    expect(nextSource).to.be.eql(
      "@import '/User/Developer/sui/module/src/index';"
    )
  })
})

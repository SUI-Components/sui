const fs = require('fs')
const path = require('path')
const util = require('util')
const {expect} = require('chai')
const childProcess = require('child_process')
const exec = util.promisify(childProcess.exec)

const SUI_BUNDLER_BINARY_DIR = path.join(__dirname, '..', '..', 'bin')

const getCWD = app => path.join(__dirname, 'integration', app)

const executeBundler = async ({cwd, env = {}}) => {
  const {stdout} = await exec(
    `node "${SUI_BUNDLER_BINARY_DIR}/sui-bundler-build" -C`,
    {
      cwd,
      env: {
        ...process.env,
        ...env
      }
    }
  )

  if (stdout.includes('Error')) {
    console.error(stdout)
  }

  return stdout
}

const getMainFileContent = ({cwd, CDN = '/'} = {}) => {
  const manifest = require(path.join(`${cwd}/public/asset-manifest.json`))
  const mainJS = manifest['main.js'].replace(CDN, '')

  return fs.readFileSync(path.join(`${cwd}/public/${mainJS}`))
}

describe('[Integration] sui-bundler', () => {
  it('builds correctly with default options', async () => {
    const CDN = 'https://my-cdn.com/'
    const cwd = getCWD('features-app')

    const stdout = await executeBundler({cwd, env: {CDN}})

    expect(stdout.includes('Error')).to.be.false

    const {stdout: lsStdout} = await exec(
      `ls "${cwd}/public" | grep -E ".js$" || true`,
      {
        cwd
      }
    )

    const mainJSContent = getMainFileContent({cwd, CDN})

    expect(lsStdout).to.be.not.eql('')

    expect(fs.existsSync(path.join(`${cwd}/public/asset-manifest.json`))).to.be
      .true

    expect(fs.readFileSync(path.join(`${cwd}/public/index.html`)).includes(CDN))
      .to.be.true

    expect(mainJSContent.includes('test_app')).to.be.true
  })

  it('builds without modern features when using supportLegacyBrowsers flag', async function () {
    const cwd = getCWD('legacy-browsers-app')
    const stdout = await executeBundler({cwd})
    expect(stdout.includes('Error')).to.be.false

    const mainJSContent = getMainFileContent({cwd})

    expect(mainJSContent.includes('=>')).to.be.false
    expect(mainJSContent.includes('`')).to.be.false
  })

  it.skip('Offline Page', async function () {
    this.timeout(0)
    // tofix
    const OFFLINE_APP_PATH = ''

    const {stdout} = await exec(
      `node "${SUI_BUNDLER_BINARY_DIR}/sui-bundler-build" -C`,
      {
        cwd: OFFLINE_APP_PATH
      }
    )

    const manifest = require(path.join(
      `${OFFLINE_APP_PATH}/public/asset-manifest.json`
    ))

    const sw = fs.readFileSync(
      path.join(`${OFFLINE_APP_PATH}/public/service-worker.js`)
    )

    Object.entries(manifest).forEach(([original, hashed]) => {
      const isRuntime = original.match('runtime')
      expect(sw.includes(hashed)).to.equal(!isRuntime)
    })

    expect(stdout.includes('Error')).to.be.false

    expect(fs.existsSync(path.join(`${OFFLINE_APP_PATH}/public/offline.html`)))
      .to.be.true

    expect(
      fs.existsSync(path.join(`${OFFLINE_APP_PATH}/public/service-worker.js`))
    ).to.be.true

    expect(
      fs
        .readFileSync(path.join(`${OFFLINE_APP_PATH}/public/service-worker.js`))
        .includes('importScripts("https://external_url.com")')
    ).to.be.true
  })

  it.skip('External Manifest', async function () {
    this.timeout(0)
    // tofix
    const EXTERNAL_MANIFEST_APP_PATH = 'tofix'
    let server
    try {
      server = childProcess.spawn(
        'node',
        [path.join(__dirname, 'integration', 'static-server.js')],
        {
          detached: false
        }
      )
      // server.stdout.pipe(process.stdout)
      // server.stderr.pipe(process.stdout)

      await exec(`node "${SUI_BUNDLER_BINARY_DIR}/sui-bundler-build" -C`, {
        cwd: EXTERNAL_MANIFEST_APP_PATH
      })

      const manifest = require(path.join(
        `${EXTERNAL_MANIFEST_APP_PATH}/public/asset-manifest.json`
      ))

      const mainJS = manifest['main.js'].replace('/', '')
      const mainCSS = manifest['main.css'].replace('/', '')

      expect(
        fs
          .readFileSync(
            path.join(`${EXTERNAL_MANIFEST_APP_PATH}/public/${mainJS}`)
          )
          .includes('http://localhost:1234/image.123abc.jpeg')
      ).to.be.true

      expect(
        fs
          .readFileSync(
            path.join(`${EXTERNAL_MANIFEST_APP_PATH}/public/${mainCSS}`)
          )
          .includes('http://localhost:1234/css-image.456def.jpeg')
      ).to.be.true
    } finally {
      server.kill()
    }
  })
})

const fs = require('fs')
const path = require('path')
const util = require('util')
const {expect} = require('chai')
const childProcess = require('child_process')
const exec = util.promisify(childProcess.exec)

const SUI_BUNDLER_BINARY_DIR = path.join(__dirname, '..', '..', 'bin')
const FEATURES_APP_PATH = path.join(__dirname, 'integration', 'features-app')
const OFFLINE_APP_PATH = path.join(__dirname, 'integration', 'offline-app')
const EXTERNAL_MANIFEST_APP_PATH = path.join(
  __dirname,
  'integration',
  'external-manifest-app'
)

describe('[Integration] sui-bundler', () => {
  it('Regresion test for features', async function() {
    this.timeout(0)
    const CDN = 'https://my-cdn.com/'
    const {stdout} = await exec(
      `node "${SUI_BUNDLER_BINARY_DIR}/sui-bundler-build" -C`,
      {
        cwd: FEATURES_APP_PATH,
        env: {
          ...process.env,
          CDN,
          APP_NAME: 'test_app'
        }
      }
    )

    const {stdout: lsStdout} = await exec(
      `ls "${FEATURES_APP_PATH}/public" | grep -E "br|gz" || true`,
      {
        cwd: FEATURES_APP_PATH
      }
    )

    const manifest = require(path.join(
      `${FEATURES_APP_PATH}/public/asset-manifest.json`
    ))

    const mainJS = manifest['main.js'].replace(CDN, '')

    expect(stdout.indexOf('Error')).to.be.eql(-1)
    expect(lsStdout).to.be.not.eql('')
    expect(
      fs.existsSync(
        path.join(`${FEATURES_APP_PATH}/public/asset-manifest.json`)
      )
    ).to.be.true
    expect(
      fs
        .readFileSync(path.join(`${FEATURES_APP_PATH}/public/index.html`))
        .indexOf(CDN)
    ).to.be.not.eql(-1)
    expect(
      fs
        .readFileSync(path.join(`${FEATURES_APP_PATH}/public/${mainJS}`))
        .indexOf('test_app')
    ).to.be.not.eql(-1)
    expect(
      fs
        .readFileSync(path.join(`${FEATURES_APP_PATH}/public/${mainJS}`))
        .indexOf('DEFAULT_VALUE')
    ).to.be.not.eql(-1)
  })

  it('Offline Page', async function() {
    this.timeout(0)
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
  expect(sw.includes(hashed)).to.equal(isRuntime ? false : true)
})

    expect(stdout.indexOf('Error')).to.be.eql(-1)
    expect(fs.existsSync(path.join(`${OFFLINE_APP_PATH}/public/offline.html`)))
      .to.be.true
    expect(
      fs.existsSync(path.join(`${OFFLINE_APP_PATH}/public/service-worker.js`))
    ).to.be.true
    expect(
      fs
        .readFileSync(path.join(`${OFFLINE_APP_PATH}/public/service-worker.js`))
        .indexOf('importScripts("https://external_url.com")')
    ).to.be.not.eql(-1)
  })

  it('External Manifest', async function() {
    this.timeout(0)
    let server
    try {
      server = childProcess.spawn(
        'node',
        [path.join(__dirname, 'integration', 'static-server.js')],
        {
          detached: false
        }
      )
      server.stdout.pipe(process.stdout)
      server.stderr.pipe(process.stdout)

      const {stdout: bundlerStdout} = await exec(
        `node "${SUI_BUNDLER_BINARY_DIR}/sui-bundler-build" -C`,
        {
          cwd: EXTERNAL_MANIFEST_APP_PATH
        }
      )
      console.log(bundlerStdout)

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
          .indexOf('http://localhost:1234/image.123abc.jpeg')
      ).to.be.not.eql(-1)
      expect(
        fs
          .readFileSync(
            path.join(`${EXTERNAL_MANIFEST_APP_PATH}/public/${mainCSS}`)
          )
          .indexOf('http://localhost:1234/css-image.456def.jpeg')
      ).to.be.not.eql(-1)
    } finally {
      server.kill()
    }
  })
})

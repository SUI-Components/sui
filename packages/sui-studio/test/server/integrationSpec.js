const fs = require('fs')
const path = require('path')
const util = require('util')
const {expect} = require('chai')
const childProcess = require('child_process')
const exec = util.promisify(childProcess.exec)

const SUI_STUDIO_BINARY_DIR = path.join(__dirname, '..', '..', 'bin')
const SAMPLE_STUDIO_PATH = path.join(__dirname, 'integration', 'sample-studio')
const EMPTY_STUDIO_PATH = path.join(__dirname, 'integration', 'empty-studio')

const safeRemoveDir = uri => {
  try {
    fs.rmdirSync(uri, {recursive: true})
  } catch (e) {}
}

describe.skip('[Integration] sui-studio', () => {
  it('Should compile and build a static version with one component', async function() {
    this.timeout(0)

    const {stdout: stdoutStudioBuild} = await exec(
      `node "${SUI_STUDIO_BINARY_DIR}/sui-studio-build" -C`,
      {
        cwd: SAMPLE_STUDIO_PATH,
        env: {
          ...process.env,
          PWD: SAMPLE_STUDIO_PATH
        }
      }
    )

    expect(stdoutStudioBuild.includes('Error')).to.be.false
  })

  it('Should start a studio in mode dev', function(done) {
    this.timeout(0)
    let server
    try {
      server = childProcess.spawn(
        'node',
        [`${SUI_STUDIO_BINARY_DIR}/sui-studio-dev`, 'atom/button'],
        {
          detached: false,
          env: {
            ...process.env,
            PWD: SAMPLE_STUDIO_PATH
          }
        }
      )
      // server.stdout.pipe(process.stdout)
      // server.stderr.pipe(process.stdout)

      const timer = setTimeout(() => {
        throw new Error('Timeout looking for OK')
      }, 30 * 1000)

      server.stdout.on('data', chunk => {
        if (chunk.toString().includes('Compiled successfully!')) {
          server.kill()
          clearTimeout(timer)
          done()
        }
      })
    } catch (error) {
      server.kill()
      done(error)
    }
  })

  describe('Generate component', () => {
    beforeEach(() => {
      safeRemoveDir(path.join(EMPTY_STUDIO_PATH, 'components', 'fake')) // eslint-disable-line
      safeRemoveDir(path.join(EMPTY_STUDIO_PATH, 'demo', 'fake')) // eslint-disable-line
      safeRemoveDir(path.join(EMPTY_STUDIO_PATH, 'test', 'fake')) // eslint-disable-line
    })
    afterEach(() => {})

    it('Should generate a new component with the proper prefix', async function() {
      this.timeout(0)

      const {
        stdout: stdoutStudioGenerate,
        stderr: stderrStudioGenerate // eslint-disable-line
      } = await exec(
        `node "${SUI_STUDIO_BINARY_DIR}/sui-studio-generate.js" -P tst -S t-est fake component`,
        {
          cwd: EMPTY_STUDIO_PATH
        }
      )

      // console.log(stdoutStudioGenerate, stderrStudioGenerate)

      const componentManifest = require(path.join(
        `${EMPTY_STUDIO_PATH}`,
        'components',
        'fake',
        'component',
        'package.json'
      ))

      expect(stdoutStudioGenerate.includes('Error')).to.be.false
      expect(componentManifest.name).to.be.eql('@t-est/tst-fake-component')
      expect(
        fs.readFileSync(
          path.join(
            `${EMPTY_STUDIO_PATH}`,
            'components',
            'fake',
            'component',
            'src',
            'index.js'
          ),
          'utf8'
        )
      ).to.be.eql(`// import PropTypes from 'prop-types'

export default function FakeComponent() {
  return (
    <div className="tst-FakeComponent">
      <h1>FakeComponent</h1>
    </div>
  )
}

FakeComponent.displayName = 'FakeComponent'
FakeComponent.propTypes = {}
`)
      expect(
        fs.readFileSync(
          path.join(
            `${EMPTY_STUDIO_PATH}`,
            'components',
            'fake',
            'component',
            'src',
            'index.scss'
          ),
          'utf8'
        )
      ).to.be.eql(`@import '~@s-ui/theme/lib/index';

.tst-FakeComponent {
  // Do your magic
}
`)

      expect(
        fs.readFileSync(
          path.join(
            `${EMPTY_STUDIO_PATH}`,
            'demo',
            'fake',
            'component',
            'playground'
          ),
          'utf8'
        )
      ).to.be.eql('return (<FakeComponent />)')

      expect(
        fs.readFileSync(
          path.join(
            `${EMPTY_STUDIO_PATH}`,
            'test',
            'fake',
            'component',
            'index.js'
          ),
          'utf8'
        )
      ).to.be.eql(`/*
 * Remember: YOUR COMPONENT IS DEFINED GLOBALLY
 * */

/* eslint react/jsx-no-undef:0 */
/* eslint no-undef:0 */

import ReactDOM from 'react-dom'

import chai, {expect} from 'chai'
import chaiDOM from 'chai-dom'

chai.use(chaiDOM)

describe('FakeComponent', () => {
  const Component = FakeComponent
  const setup = setupEnvironment(Component)

  it('should render without crashing', () => {
    // Given
    const props = {}

    // When
    const component = <Component {...props} />

    // Then
    const div = document.createElement('div')
    ReactDOM.render(component, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  it('should NOT render null', () => {
    // Given
    const props = {}

    // When
    const {container} = setup(props)

    // Then
    expect(container.innerHTML).to.be.a('string')
    expect(container.innerHTML).to.not.have.lengthOf(0)
  })

  it('example to be deleted', () => {
    // Example TO BE DELETED!!!!

    // Given
    // const props = {}

    // When
    // const {getByRole} = setup(props)

    // Then
    // expect(getByRole('button')).to.have.text('HOLA')
    expect(true).to.be.eql(false)
  })
})
`)
    })
  })
})

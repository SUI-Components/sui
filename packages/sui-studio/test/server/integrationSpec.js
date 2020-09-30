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

describe('[Integration] sui-studio', () => {
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
      ).to.be.eql(`import React from 'react'
// import PropTypes from 'prop-types'

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
      ).to.be.eql(`const {
  Article,
  Heading,
  Quote,
  Text,
  Paragraph,
  Code,
  Anchor,
  List,
  Label,
  Button,
  Grid,
  Separator
} = window.DOC

return (
  <div className="sui-StudioPreview">
    <Heading.H1>&lt;Component Name&gt;</Heading.H1>
    <Paragraph>
      &lt;This is a placeholder text. Replace it with the component usage description&gt; 
    </Paragraph>
    <Grid cols={1} gutter={10}>
      <Grid.Cell>
        <Article>
          <Heading.H2>&lt;Prop&gt;</Heading.H2>
          <Paragraph>
            &lt;Replace me for the prop description&gt;
          </Paragraph>
          <FakeComponent />)
        </Article>
      </Grid.Cell>
    </Grid>
    <!-- also remove this demo until next comment-->
    <Grid cols={2} gutter={[5, 10]}>
      <Grid.Cell>
        <Article>
          <Grid cols={1} gutter={[5, 10]}>
            <Grid.Cell>
              <Heading.H1>Heading one</Heading.H1>
            </Grid.Cell>
            <Grid.Cell>
              <Heading.H2>Heading two</Heading.H2>
            </Grid.Cell>
            <Grid.Cell>
              <Heading.H3>Heading three</Heading.H3>
            </Grid.Cell>
            <Grid.Cell>
              <Heading.H4>Heading four</Heading.H4>
            </Grid.Cell>
            <Grid.Cell>
              <Paragraph>
                This is just an example of a paragraph styled using the{' '}
                <Code>Code</Code> element with a random text just to get a
                few more lines here.
              </Paragraph>
            </Grid.Cell>
            <Grid.Cell>
              <Paragraph>
                <Anchor href="#">This is a link</Anchor>
              </Paragraph>
            </Grid.Cell>
            <Grid.Cell>
              <List.Unordered>
                <List.Item>Item number 1</List.Item>
                <List.Item>Item number 2</List.Item>
                <List.Item>Item number 3</List.Item>
              </List.Unordered>
            </Grid.Cell>
            <Grid.Cell>
              <List.Ordered>
                <List.Item>Item number 1</List.Item>
                <List.Item>Item number 2</List.Item>
                <List.Item>Item number 3</List.Item>
              </List.Ordered>
            </Grid.Cell>
            <Grid.Cell>
              <Paragraph>
                <Label>This is a label</Label>
              </Paragraph>
            </Grid.Cell>
            <Grid.Cell>
              <Button fullWidth>button</Button>
            </Grid.Cell>
            <Grid.Cell>
              <Button outline fullWidth>
                button
              </Button>
            </Grid.Cell>
            <Grid.Cell offset={1}>
              <Button.Group fullWidth>
                <Button>button</Button>
                <Button>button</Button>
                <Button>button</Button>
                <Button>button</Button>
                <Button>button</Button>
              </Button.Group>
            </Grid.Cell>
            <Grid.Cell offset={1}>
              <Button.Group outline fullWidth>
                <Button>button</Button>
                <Button>button</Button>
                <Button>button</Button>
                <Button>button</Button>
                <Button>button</Button>
              </Button.Group>
            </Grid.Cell>
            <Grid.Cell offset={1}>
              <Quote>Quote</Quote>
            </Grid.Cell>
            <Grid.Cell offset={1}>
              <Text>Text</Text>
            </Grid.Cell>
            <Grid.Cell offset={1}>
              <Grid cols={3} gutter={[5, 5]}>
                <Grid.Cell>
                  <Text.Bold>Text.Bold</Text.Bold>
                </Grid.Cell>
                <Grid.Cell>
                  <Text.Strong>Text.Strong</Text.Strong>
                </Grid.Cell>
                <Grid.Cell>
                  <Text.Italic>Text.Italic</Text.Italic>
                </Grid.Cell>
                <Grid.Cell>
                  <Text.Emphasized>Text.Emphasized</Text.Emphasized>
                </Grid.Cell>
                <Grid.Cell>
                  <Text.Mark>Text.Mark</Text.Mark>
                </Grid.Cell>
                <Grid.Cell>
                  <Text.Small>Text.Small</Text.Small>
                </Grid.Cell>
                <Grid.Cell>
                  <Text.Deleted>Text.Deleted</Text.Deleted>
                </Grid.Cell>
              </Grid>
            </Grid.Cell>
            <Grid.Cell offset={1}>
              <Separator />
              <Separator>Separator</Separator>
            </Grid.Cell>
          </Grid>
        </Article>
      </Grid.Cell>
      <Grid.Cell>
        <Article mode="dark">
          <Grid cols={1} gutter={[5, 10]}>
            <Grid.Cell>
              <Heading.H1>Heading one</Heading.H1>
            </Grid.Cell>
            <Grid.Cell>
              <Heading.H2>Heading two</Heading.H2>
            </Grid.Cell>
            <Grid.Cell>
              <Heading.H3>Heading three</Heading.H3>
            </Grid.Cell>
            <Grid.Cell>
              <Heading.H4>Heading four</Heading.H4>
            </Grid.Cell>
            <Grid.Cell>
              <Paragraph>
                This is just an example of a paragraph styled using the{' '}
                <Code>Code</Code> element with a random text
                just to get a few more lines here.
              </Paragraph>
            </Grid.Cell>
            <Grid.Cell>
              <Paragraph>
                <Anchor href="#">
                  This is a link
                </Anchor>
              </Paragraph>
            </Grid.Cell>
            <Grid.Cell>
              <List.Unordered>
                <List.Item>Item number 1</List.Item>
                <List.Item>Item number 2</List.Item>
                <List.Item>Item number 3</List.Item>
              </List.Unordered>
            </Grid.Cell>
            <Grid.Cell>
              <List.Ordered>
                <List.Item>Item number 1</List.Item>
                <List.Item>Item number 2</List.Item>
                <List.Item>Item number 3</List.Item>
              </List.Ordered>
            </Grid.Cell>
            <Grid.Cell>
              <Paragraph>
                <Label>This is a label</Label>
              </Paragraph>
            </Grid.Cell>
            <Grid.Cell>
              <Button fullWidth>
                button
              </Button>
            </Grid.Cell>
            <Grid.Cell>
              <Button outline fullWidth>
                button
              </Button>
            </Grid.Cell>
            <Grid.Cell>
              <Button.Group fullWidth>
                <Button>button</Button>
                <Button>button</Button>
                <Button>button</Button>
                <Button>button</Button>
                <Button>button</Button>
              </Button.Group>
            </Grid.Cell>
            <Grid.Cell>
              <Button.Group outline fullWidth>
                <Button>button</Button>
                <Button>button</Button>
                <Button>button</Button>
                <Button>button</Button>
                <Button>button</Button>
              </Button.Group>
            </Grid.Cell>
            <Grid.Cell>
              <Quote>Quote</Quote>
            </Grid.Cell>
            <Grid.Cell>
              <Text>Text</Text>
            </Grid.Cell>
            <Grid.Cell>
              <Grid cols={3} gutter={[5, 5]}>
                <Grid.Cell>
                  <Text.Bold>Text.Bold</Text.Bold>
                </Grid.Cell>
                <Grid.Cell>
                  <Text.Strong>Text.Strong</Text.Strong>
                </Grid.Cell>
                <Grid.Cell>
                  <Text.Italic>Text.Italic</Text.Italic>
                </Grid.Cell>
                <Grid.Cell>
                  <Text.Emphasized>
                    Text.Emphasized
                  </Text.Emphasized>
                </Grid.Cell>
                <Grid.Cell>
                  <Text.Mark>Text.Mark</Text.Mark>
                </Grid.Cell>
                <Grid.Cell>
                  <Text.Small>Text.Small</Text.Small>
                </Grid.Cell>
                <Grid.Cell>
                  <Text.Deleted>Text.Deleted</Text.Deleted>
                </Grid.Cell>
              </Grid>
            </Grid.Cell>
            <Grid.Cell>
              <Separator />
              <Separator>Separator</Separator>
            </Grid.Cell>
          </Grid>
        </Article>
      </Grid.Cell>
    </Grid>
    <!-- also remove this demo until previous comment-->
  </div>
)
`)

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

import React from 'react'
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

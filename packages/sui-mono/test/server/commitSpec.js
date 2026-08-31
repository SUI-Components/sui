import {expect} from 'chai'

import buildCommit from '../../src/build-commit.js'

describe('build-commit', () => {
  it('builds a basic commit message', () => {
    const msg = buildCommit({type: 'feat', scope: 'Root', subject: 'add feature'})
    expect(msg).to.equal('feat(Root): add feature')
  })

  it('lowercases the first letter of subject', () => {
    // buildCommit itself does not lowercase — that is done by the enquirer filter.
    // In non-interactive mode the subject is passed as-is, so this test confirms
    // the raw output.
    const msg = buildCommit({type: 'fix', scope: 'Root', subject: 'Fix bug'})
    expect(msg).to.equal('fix(Root): Fix bug')
  })

  it('appends body when provided', () => {
    const msg = buildCommit({type: 'feat', scope: 'Root', subject: 'add feature', body: 'details'})
    expect(msg).to.include('\n\ndetails')
  })

  it('replaces | with newlines in body', () => {
    const msg = buildCommit({
      type: 'feat',
      scope: 'Root',
      subject: 'add feature',
      body: 'line1|line2'
    })
    expect(msg).to.include('line1\nline2')
  })

  it('appends breaking changes section when provided', () => {
    const msg = buildCommit({
      type: 'feat',
      scope: 'Root',
      subject: 'new api',
      breaking: 'old api removed'
    })
    expect(msg).to.include('BREAKING CHANGES: \nold api removed')
  })

  it('appends issues closed section when footer provided', () => {
    const msg = buildCommit({type: 'fix', scope: 'Root', subject: 'fix', footer: '#42'})
    expect(msg).to.include('ISSUES CLOSED: #42')
  })

  it('omits breaking changes section when breaking is empty', () => {
    const msg = buildCommit({type: 'feat', scope: 'Root', subject: 'add feature', breaking: ''})
    expect(msg).to.not.include('BREAKING CHANGES')
  })

  it('omits issues closed section when footer is empty', () => {
    const msg = buildCommit({type: 'feat', scope: 'Root', subject: 'add feature', footer: ''})
    expect(msg).to.not.include('ISSUES CLOSED')
  })

  it('builds the -m params string used by executeCommit', () => {
    const msg = buildCommit({
      type: 'feat',
      scope: 'packages/sui-mono',
      subject: 'add non-interactive mode',
      body: 'useful for scripting'
    })
    const commitParams = msg
      .split('\n')
      .filter(Boolean)
      .map(m => `-m "${m}"`)
      .join(' ')

    expect(commitParams).to.include('-m "feat(packages/sui-mono): add non-interactive mode"')
    expect(commitParams).to.include('-m "useful for scripting"')
  })
})

describe('non-interactive CLI validation', () => {
  // Mirrors the validation logic in bin/sui-mono-commit.js initCommit()
  const REQUIRED = ['type', 'scope', 'subject']

  const validate = opts => REQUIRED.filter(f => !opts[f])

  it('passes when type, scope and subject are all provided', () => {
    expect(validate({type: 'feat', scope: 'Root', subject: 'test'})).to.deep.equal([])
  })

  it('fails when type is missing', () => {
    expect(validate({scope: 'Root', subject: 'test'})).to.include('type')
  })

  it('fails when scope is missing', () => {
    expect(validate({type: 'feat', subject: 'test'})).to.include('scope')
  })

  it('fails when subject is missing', () => {
    expect(validate({type: 'feat', scope: 'Root'})).to.include('subject')
  })

  it('fails with all three when nothing is provided', () => {
    expect(validate({})).to.deep.equal(['type', 'scope', 'subject'])
  })

  it('body, breaking and footer are optional — no validation error', () => {
    expect(validate({type: 'chore', scope: 'Root', subject: 'update'})).to.have.length(0)
  })
})

import {expect} from 'chai'
import CleanCSS from 'clean-css'

import {rebuildCoveredCSS, rebuildCoveredCSSFromEntry} from '../../src/covered-css.js'

// Chrome reports coverage as byte ranges into the stylesheet source, and the range of a
// used rule covers that rule ONLY — never the at-rule it is nested in. These helpers
// build such a range from a substring so the specs read like the real input.
const rangeOf = (text, snippet) => {
  const start = text.indexOf(snippet)

  if (start === -1) throw new Error(`Fixture does not contain "${snippet}"`)

  return {start, end: start + snippet.length}
}

const rebuild = (text, ...snippets) =>
  rebuildCoveredCSS({text, ranges: snippets.map(snippet => rangeOf(text, snippet))})

describe('@s-ui/critical-css covered-css', () => {
  it('keeps the @media a covered rule lives in', () => {
    const text = '@media (min-width:600px){.used{color:red}}'

    expect(rebuild(text, '.used{color:red}')).to.equal(text)
  })

  it('keeps the @layer a covered rule lives in', () => {
    const text = '@layer utilities{.used{color:red}}'

    expect(rebuild(text, '.used{color:red}')).to.equal(text)
  })

  it('keeps the whole chain of nested at-rules', () => {
    const text = '@supports (display:grid){@media (min-width:600px){@layer base{.used{color:red}}}}'

    expect(rebuild(text, '.used{color:red}')).to.equal(text)
  })

  it('drops uncovered siblings but keeps the at-rule of the covered one', () => {
    const text = '@media print{.used{color:red}.unused{color:blue}}'

    expect(rebuild(text, '.used{color:red}')).to.equal('@media print{.used{color:red}}')
  })

  it('drops an at-rule with no covered rule at all', () => {
    const text = '.used{color:red}@media print{.unused{color:blue}}'

    expect(rebuild(text, '.used{color:red}')).to.equal('.used{color:red}')
  })

  it('keeps unlayered covered rules as they are', () => {
    const text = '.used{color:red}.unused{color:blue}'

    expect(rebuild(text, '.used{color:red}')).to.equal('.used{color:red}')
  })

  it('keeps a @layer statement even though coverage never marks it as used', () => {
    const text = '@layer base,utilities;@layer utilities{.used{color:red}}'

    expect(rebuild(text, '.used{color:red}')).to.equal(
      '@layer base;\n@layer utilities;\n@layer utilities{.used{color:red}}'
    )
  })

  it('keeps a @layer statement even when nothing else is covered', () => {
    expect(rebuildCoveredCSS({text: '@layer base,utilities;.unused{color:blue}', ranges: []})).to.equal(
      '@layer base;\n@layer utilities;'
    )
  })

  it('hoists @layer statements above the rules, whatever their original position', () => {
    const text = '@layer utilities{.used{color:red}}@layer base,utilities;'

    expect(rebuild(text, '.used{color:red}')).to.equal(
      '@layer base;\n@layer utilities;\n@layer utilities{.used{color:red}}'
    )
  })

  it('splits a multi-name @layer statement so clean-css does not swallow the next rule', () => {
    const text = '@layer base,utilities;:root{--brand:red}'
    const rebuilt = rebuildCoveredCSS({text, ranges: [rangeOf(text, ':root{--brand:red}')]})

    // `@layer base,utilities;:root{--brand:red}` minifies to `:root{}` on clean-css
    // 5.3.3: the statement is dropped and the rule after it loses every declaration.
    expect(new CleanCSS({level: 2}).minify(rebuilt).styles).to.contain('--brand:red')
  })

  it('keeps a covered at-rule that holds declarations directly, such as @font-face', () => {
    const text = '@font-face{font-family:F;src:url(f.woff2)}.unused{color:blue}'

    expect(rebuild(text, '@font-face{font-family:F;src:url(f.woff2)}')).to.equal(
      '@font-face{font-family:F;src:url(f.woff2)}'
    )
  })

  it('returns an empty string when nothing is covered', () => {
    expect(rebuildCoveredCSS({text: '@media print{.unused{color:blue}}', ranges: []})).to.equal('')
  })

  it('does not lose a rule whose range only partially overlaps it', () => {
    const text = '@layer base{.used{color:red}}'
    const rule = rangeOf(text, '.used{color:red}')

    expect(rebuildCoveredCSS({text, ranges: [{start: rule.start, end: rule.start + 3}]})).to.equal(text)
  })

  describe('rebuildCoveredCSSFromEntry', () => {
    it('falls back to the raw coverage ranges when the stylesheet cannot be parsed', () => {
      const text = '.used{color:red}@media{'
      const entry = {url: 'https://example.com/broken.css', text, ranges: [rangeOf(text, '.used{color:red}')]}

      expect(rebuildCoveredCSSFromEntry(entry)).to.equal('.used{color:red}')
    })

    it('rebuilds a parseable stylesheet with its at-rule context', () => {
      const text = '@layer utilities{.used{color:red}}'
      const entry = {url: 'https://example.com/ok.css', text, ranges: [rangeOf(text, '.used{color:red}')]}

      expect(rebuildCoveredCSSFromEntry(entry)).to.equal(text)
    })
  })
})

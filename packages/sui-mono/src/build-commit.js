const wrap = require('word-wrap')

const MAX_LINE_WIDTH = 100
const WRAP_OPTIONS = {
  trim: true,
  newline: '\n',
  indent: '',
  width: MAX_LINE_WIDTH
}

const addScope = scope => `(${scope.trim()}): `
const addSubject = subject => subject.trim()

module.exports = function buildCommit(answers) {
  const {breaking, body, scope, subject, footer, type} = answers
  const commitMsg = `${type}${addScope(scope)}${addSubject(subject)}`
  let result = commitMsg.slice(0, MAX_LINE_WIDTH)

  // Wrap these lines at 100 characters
  let bodyMsg = wrap(body, WRAP_OPTIONS) || ''
  bodyMsg = bodyMsg.split('|').join('\n')

  const breakingMsg = wrap(breaking, WRAP_OPTIONS)
  const footerMsg = wrap(footer, WRAP_OPTIONS)

  if (bodyMsg) result += `\n\n${bodyMsg}`
  if (breaking) result += `\n\nBREAKING CHANGES: \n${breakingMsg}`
  if (footer) result += `\n\nISSUES CLOSED: ${footerMsg}`

  return result
}

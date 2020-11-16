const wrap = require('word-wrap')

const MAX_LINE_WIDTH = 100
const wrapOptions = {
  trim: true,
  newline: '\n',
  indent: '',
  width: MAX_LINE_WIDTH
}

const addScope = scope => `(${scope.trim()}): `
const addSubject = subject => subject.trim()
const escapeSpecialChars = result => {
  const specialChars = ['`']

  specialChars.forEach(item => {
    // For some strange reason, we have to pass additional '\' slash to commitizen. Total slashes are 4.
    // If user types "feat: `string`", the commit preview should show "feat: `\\string\\`".
    // Don't worry. The git log will be "feat: `string`"
    result = result.replace(new RegExp(item, 'g'), '\\\\`')
  })

  return result
}

module.exports = function buildCommit(answers) {
  // Hard limit this line
  const head = (
    answers.type +
    addScope(answers.scope) +
    addSubject(answers.subject)
  ).slice(0, MAX_LINE_WIDTH)

  // Wrap these lines at 100 characters
  let body = wrap(answers.body, wrapOptions) || ''
  body = body.split('|').join('\n')

  const breaking = wrap(answers.breaking, wrapOptions)
  const footer = wrap(answers.footer, wrapOptions)

  let result = head

  if (body) result += '\n\n' + body
  if (breaking) result += '\n\n' + 'BREAKING CHANGE:\n' + breaking
  if (footer) result += '\n\nISSUES CLOSED: ' + footer

  return escapeSpecialChars(result)
}

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
  const {breaking, body, scope, subject, footer, type} = answers
  const commitMsg = `${type}${addScope(scope)}${addSubject(subject)}`
  const commitMsgTrimmed = commitMsg.slice(0, MAX_LINE_WIDTH)

  // Wrap these lines at 100 characters
  let bodyMsg = wrap(body, wrapOptions) || ''
  bodyMsg = bodyMsg.split('|').join('\n')

  const breakingMsg = wrap(breaking, wrapOptions)
  const footerMsg = wrap(footer, wrapOptions)

  let result = commitMsgTrimmed

  if (bodyMsg) result += '\n\n' + bodyMsg
  if (breaking) result += '\n\n' + 'BREAKING CHANGE:\n' + breakingMsg
  if (footer) result += '\n\nISSUES CLOSED: ' + footerMsg

  return escapeSpecialChars(result)
}

module.exports = (regExp = '(.*)') => `{
  "pathnameRegExp": "${regExp}",
  "hrefRegExp": "${regExp}",
  "private": true,
  "version": "1.0.0"
}`

// part of the code extracted from. https://github.com/epeli/underscore.string/blob/master/cleanDiacritics.js
const from = 'ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșşšŝťțţŭùúüűûñÿýçżźž'
const to = 'aaaaaaaaaccceeeeeghiiiijllnnoooooooossssstttuuuuuunyyczzz'.split('')

function replaceCharIfNeeded(char) {
  const index = from.indexOf(char)
  return index === -1 ? char : to[index]
}

export function slugify(str, allowQueryParams) {
  const validCharsRegEx = allowQueryParams
    ? /[^a-z0-9\\. \- ? =]/g // only letters numbers, dashes, dots, equals and question marks
    : /[^a-z0-9\\. -]/g // only letters numbers, dashes and dots
  return str
    .toLowerCase()
    .replace(/.{1}/g, replaceCharIfNeeded)
    .replace(validCharsRegEx, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
}

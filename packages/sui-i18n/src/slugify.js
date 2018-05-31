// part of the code extracted from. https://github.com/epeli/underscore.string/blob/master/cleanDiacritics.js
const from = 'ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșşšŝťțţŭùúüűûñÿýçżźž'
const to = 'aaaaaaaaaccceeeeeghiiiijllnnoooooooossssstttuuuuuunyyczzz'.split('')

function replaceCharIfNeeded(char) {
  const index = from.indexOf(char)
  return index === -1 ? char : to[index]
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/.{1}/g, replaceCharIfNeeded)
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
}

const parse5 = require('parse5')

function hasChildren(node) {
  return (
    typeof node === 'object' &&
    node.childNodes &&
    typeof node.childNodes !== 'undefined' &&
    node.childNodes.length > 0
  )
}

const _removeMarkedTags = document => {
  if (!hasChildren(document)) {
    return
  }

  document.childNodes = document.childNodes.filter((node, index) => {
    if (index === 0) {
      return true
    }

    const prevNode = document.childNodes[index - 1]

    if (
      prevNode.nodeName === '#comment' &&
      (prevNode.data || '').indexOf('THIRD_PARTY') > -1
    ) {
      return false
    }

    return true
  })

  document.childNodes.forEach(_removeMarkedTags)
}

exports.removeMarkedTags = html => {
  const document = parse5.parse(html)
  _removeMarkedTags(document)
  return parse5.serialize(document)
}

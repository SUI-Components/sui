const parse5 = require('parse5')
const {readFileSync, writeFileSync} = require('fs')
const path = require('path')

const joinParsedHtmlVersions = () => {
  const es5RawHTML = readFileSync(
    path.resolve(process.cwd(), 'public', 'es5', 'index.html'),
    'utf-8'
  )
  const es6RawHTML = readFileSync(
    path.resolve(process.cwd(), 'public', 'es6', 'index.html'),
    'utf-8'
  )

  const parse5Es5AstHTML = parse5.parse(es5RawHTML)
  const parse5Es6AstHTML = parse5.parse(es6RawHTML)

  const parse5Es5Head = parse5Es5AstHTML.childNodes
    .find(node => node.tagName === 'html')
    .childNodes.find(node => node.tagName === 'head')

  const noModulesScripts = parse5Es5Head.childNodes.filter(
    node =>
      node.tagName === 'script' &&
      node.attrs.some(attr => attr.name === 'nomodule')
  )

  const noModulesLinks = parse5Es5Head.childNodes.filter(
    node =>
      node.tagName === 'link' &&
      node.attrs.some(attr => attr.name === 'nomodule')
  )

  const parse5Es6Head = parse5Es6AstHTML.childNodes
    .find(node => node.tagName === 'html')
    .childNodes.find(node => node.tagName === 'head')

  parse5Es6Head.childNodes = [
    ...parse5Es6Head.childNodes,
    ...noModulesLinks,
    ...noModulesScripts
  ]

  writeFileSync(
    path.resolve(process.cwd(), 'public', 'index.html'),
    parse5.serialize(parse5Es6AstHTML),
    'utf-8'
  )
}

module.exports = joinParsedHtmlVersions

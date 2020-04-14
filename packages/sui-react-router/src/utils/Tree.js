// from: https://jrsinclair.com/articles/2019/functional-js-traversing-trees-with-recursive-reduce/

const curry = (fn, arity = fn.length, ...args) =>
  arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args)

function hasChildren(node) {
  return (
    typeof node === 'object' &&
    typeof node.children !== 'undefined' &&
    node.children.length > 0
  )
}

export const Tree = {
  reduce: curry(function reduce(reducerFn, init, node) {
    const acc = reducerFn(init, node)
    if (!hasChildren(node)) {
      return acc
    }
    return node.children.reduce(Tree.reduce(reducerFn), acc)
  }),
  map: curry(function map(mapFn, node) {
    const newNode = mapFn(node)
    if (hasChildren(node)) {
      return newNode
    }
    newNode.children = node.children.map(Tree.map(mapFn))
    return newNode
  }),
  forEach: curry(function forEach(eachFn, node) {
    eachFn(node)
    if (hasChildren(node)) {
      node.children.forEach(Tree.forEach(eachFn))
    }
  })
}

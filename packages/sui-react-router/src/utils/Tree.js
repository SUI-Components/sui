// from: https://jrsinclair.com/articles/2019/functional-js-traversing-trees-with-recursive-reduce/

/**
 * Check if there're still children to process in the actual node
 * @param {{ children: Array }} node Object with route info
 * @returns {Boolean}
 */
function hasChildren(node) {
  return (
    typeof node === 'object' &&
    typeof node.children !== 'undefined' &&
    node.children.length > 0
  )
}

export const Tree = {
  reduce(reducerFn, init, node) {
    // Calculate the reduced value for this node
    const acc = reducerFn(init, node)
    // Stop processing tree structure if no further children
    if (!hasChildren(node)) return acc
    // Recursive transverse tree structure
    return node.children.reduce(
      (acc, currentValue) => Tree.reduce(reducerFn, acc, currentValue),
      acc
    )
  }
}

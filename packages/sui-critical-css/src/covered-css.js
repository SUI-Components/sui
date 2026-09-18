import postcss from 'postcss'

// Chrome's CSS coverage reports ranges that cover the style rule ONLY. The `@media`,
// `@layer`, `@supports` or `@container` block the rule lives in is never part of the
// range, so slicing the raw bytes out of `entry.text` and concatenating them produces
// CSS that has lost every at-rule wrapper. Two things break as a result:
//
//   1. Nothing is layered any more, so ties that the layer order used to decide now
//      fall back to source order. A `@layer base` reset extracted after a
//      `@layer utilities` rule of the same specificity silently starts winning.
//   2. Media queries are flattened, so rules only meant for the extraction viewport
//      apply at every width.
//
// So instead of slicing bytes, parse the stylesheet and rebuild it: keep every
// declaration-holding node whose source range intersects a covered range, together
// with its whole chain of ancestor at-rules.
const KEEP_AT_RULE = 'layer'

const holdsDeclarations = node =>
  node.type === 'rule' || (node.type === 'atrule' && node.nodes?.some(child => child.type === 'decl'))

// `@layer a, b, c;` is a statement, not a style rule, so coverage never marks it as
// used — yet it is the only thing that fixes the order of the layers. Always keep it.
const isLayerStatement = node =>
  node.type === 'atrule' && node.nodes === undefined && node.name.toLowerCase() === KEEP_AT_RULE

const intersectsCoveredRange = (node, ranges) => {
  const start = node.source?.start?.offset
  const end = node.source?.end?.offset

  if (start === undefined || end === undefined) return false

  return ranges.some(range => range.start < end && range.end > start)
}

/**
 * Rebuild the used part of a stylesheet from its Chrome CSS coverage ranges, keeping
 * the at-rule context of every rule it keeps.
 *
 * @param {object} params
 * @param {string} params.text Full source of the stylesheet, as reported by coverage.
 * @param {Array<{start: number, end: number}>} params.ranges Covered byte ranges.
 * @returns {string} CSS containing only the covered rules, still wrapped in their
 *   original at-rules, with every `@layer` statement hoisted to the top.
 */
export const rebuildCoveredCSS = ({text, ranges}) => {
  const root = postcss.parse(text)
  const keep = new Set()
  const layerStatements = []

  const keepWithAncestors = node => {
    for (let current = node; current && current.type !== 'root'; current = current.parent) keep.add(current)
  }

  root.walk(node => {
    // postcss leaves the terminating `;` of a bodyless at-rule to the parent's
    // stringifier, so it has to be added back when lifting the node out on its own.
    if (isLayerStatement(node)) return layerStatements.push(`${node.toString()};`)
    if (holdsDeclarations(node) && intersectsCoveredRange(node, ranges)) keepWithAncestors(node)
  })

  const discarded = []
  root.walk(node => {
    if ((node.type === 'rule' || node.type === 'atrule') && keep.has(node) === false) discarded.push(node)
  })
  discarded.forEach(node => node.remove())

  // Coverage entries are not guaranteed to be in document order, so a `@layer`
  // statement could otherwise end up after a rule that already registered the layers
  // in the wrong order. Hoisting makes the result independent of entry order.
  return [...layerStatements, root.toString()].filter(Boolean).join('\n')
}

/**
 * Same as `rebuildCoveredCSS`, but never throws: a stylesheet postcss cannot parse
 * falls back to the old byte-slicing behaviour instead of failing the whole
 * extraction. The fallback loses at-rule context, so it is logged loudly.
 *
 * @param {object} entry A single Chrome CSS coverage entry.
 * @returns {string}
 */
export const rebuildCoveredCSSFromEntry = entry => {
  try {
    return rebuildCoveredCSS(entry)
  } catch (error) {
    console.warn(
      `[ko] Could not parse ${entry.url ?? 'a stylesheet'} (${error.message}).`,
      'Falling back to raw coverage ranges, so its @media and @layer context is lost.'
    )

    return entry.ranges.reduce((css, range) => css + entry.text.slice(range.start, range.end), '')
  }
}

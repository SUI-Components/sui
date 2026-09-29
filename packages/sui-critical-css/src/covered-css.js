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
//
// The same "ranges cover style rules only" limitation also means an at-rule that
// DEFINES something rather than styling something is never attributable to a range,
// so it can only be carried over by an explicit exception. See `isDefinitionAtRule`
// and `isKeyframes` below.
const KEEP_AT_RULE = 'layer'

// `@property` registers a custom property and `@font-face` a font: neither matches an
// element, so coverage never reports a range for them and both used to be dropped from
// every rebuild. Measured on a Tailwind v4 app: 0 `@property` and 0 `@font-face` in the
// rebuilt CSS against 29 and 5 in the source sheet.
//
// The `@property` gap changes what the browser paints. `border-style:var(--tw-border-style)`
// with the registration missing resolves to the empty token, which is invalid at computed-value
// time, so `border-style` computes to its initial `none` — and with `border-style:none` the
// computed `border-width` is `0px` even though the utility's `1px` applied and won the cascade.
// A button styled that way renders with no border at all until the full stylesheet arrives.
//
// Both are cheap to keep and safe to keep when unused: a registration only sets an initial
// value, and a `@font-face` never triggers a download unless a matched rule asks for the family.
const DEFINITION_AT_RULES = ['property', 'font-face']

// `@keyframes` holds rules, not declarations, and those inner rules
// (`from{}`, `50%{}`) never match an element either. Unlike the two above it is not
// bounded in size, so it is only carried over when a declaration that survived the
// rebuild actually names it.
const KEYFRAMES_AT_RULE = /^(-\w+-)?keyframes$/
const ANIMATION_DECLARATIONS = ['animation', 'animation-name']
const ANIMATION_VALUE_SEPARATOR = /[\s,]+/

const atRuleName = node => node.name.toLowerCase()

const holdsDeclarations = node =>
  node.type === 'rule' || (node.type === 'atrule' && node.nodes?.some(child => child.type === 'decl'))

// `@layer a, b, c;` is a statement, not a style rule, so coverage never marks it as
// used — yet it is the only thing that fixes the order of the layers. Always keep it.
const isLayerStatement = node =>
  node.type === 'atrule' && node.nodes === undefined && node.name.toLowerCase() === KEEP_AT_RULE

const isDefinitionAtRule = node => node.type === 'atrule' && DEFINITION_AT_RULES.includes(atRuleName(node))

const isKeyframes = node => node.type === 'atrule' && KEYFRAMES_AT_RULE.test(atRuleName(node))

// Only the direct declarations of a node, so scanning a kept `@media` does not reach the
// declarations of the children that were discarded from it.
const animationNamesOf = node => {
  const names = []

  node.each?.(child => {
    if (child.type !== 'decl' || !ANIMATION_DECLARATIONS.includes(child.prop.toLowerCase())) return

    // Every token of the shorthand, since the name can sit anywhere in it. A duration or a
    // timing function that happens to match a `@keyframes` name only keeps one extra rule.
    names.push(...child.value.split(ANIMATION_VALUE_SEPARATOR))
  })

  return names
}

// One statement per layer name, because clean-css 5.3.3 mis-parses a bodyless `@layer`
// that names more than one layer: it drops the statement AND every declaration of the
// rule that follows it (`@layer a,b;.x{color:red}` minifies to nothing at all). A
// sequence of single-name statements establishes exactly the same order.
const splitLayerStatement = node => node.params.split(',').map(name => `@${node.name} ${name.trim()};`)

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
  const nestedLayerStatements = []
  const keyframes = []

  const keepWithAncestors = node => {
    for (let current = node; current && current.type !== 'root'; current = current.parent) keep.add(current)
  }

  // An at-rule kept as a whole needs its children kept too, or the pass that removes
  // everything uncovered would empty it out.
  const keepWithSubtree = node => {
    keepWithAncestors(node)
    node.walk?.(child => keep.add(child))
  }

  root.walk(node => {
    if (isLayerStatement(node)) {
      if (node.parent.type === 'root') return layerStatements.push(...splitLayerStatement(node))

      // A statement inside `@supports` or `@media` only registers its layers while that
      // condition holds, and one inside another `@layer` names sublayers of it, so it
      // cannot be hoisted out of its parent the way a top-level one can. Keep it in place.
      return nestedLayerStatements.push(node)
    }
    if (isDefinitionAtRule(node)) return keepWithSubtree(node)
    if (isKeyframes(node)) return keyframes.push(node)
    if (holdsDeclarations(node) && intersectsCoveredRange(node, ranges)) keepWithAncestors(node)
  })

  // After the walk, so it sees every node the rebuild is going to keep.
  const animationNames = new Set([...keep].flatMap(animationNamesOf))
  keyframes.forEach(node => {
    if (animationNames.has(node.params.trim())) keepWithSubtree(node)
  })

  // Replacing them during the walk above would make postcss visit the statements the split
  // produces, so they are only rewritten once the walk is over.
  nestedLayerStatements.forEach(node => {
    const replacements = splitLayerStatement(node).map(statement => postcss.parse(statement).first)

    node.replaceWith(...replacements)
    replacements.forEach(keepWithAncestors)
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

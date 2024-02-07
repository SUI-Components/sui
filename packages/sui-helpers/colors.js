// Ansi Escape Codes: https://tforgione.fr/posts/ansi-escape-codes/

const colorify = color => `\x1b[${color}m`
const RESET_COLOR = 0
const DEFINED_COLORS = {
  bold: 1,
  cyan: 36,
  red: 31,
  gray: 90,
  green: 32,
  yellow: 35
}

/** @type {{ bold: function, cyan: function, red: function, gray: function, green: function, yellow: function }} */
const colors = {}

Object.entries(DEFINED_COLORS).forEach(([colorKey, colorPrefix]) => {
  colors[colorKey] = msg => `${colorify(colorPrefix)}${msg}${colorify(RESET_COLOR)}`
})

module.exports = colors

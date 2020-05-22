/** Just export a true or false depending on the environment */
export default Boolean(
  typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
)

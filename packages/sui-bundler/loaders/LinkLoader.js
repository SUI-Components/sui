function linkLoader(source) {
  const entries = this.query.entryPoints

  const linkedSource = Object.keys(entries).reduce((modifySource, entry) => {
    return modifySource.replace(
      new RegExp(`~?${entry}(\\/lib)?`, 'g'),
      entries[entry]
    )
  }, source)

  console.log(source, linkedSource)
  return linkedSource
}

module.exports = linkLoader

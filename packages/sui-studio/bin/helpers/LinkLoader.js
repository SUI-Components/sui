function linkLoader(source) {
  const entries = this.query.entryPointsComponents
  const linkedSource = Object.keys(entries).reduce((modifySource, entry) => {
    return modifySource.replace(
      new RegExp(`~?${entry}(\\/lib)?`, 'g'),
      entries[entry]
    )
  }, source)

  return linkedSource
}

module.exports = linkLoader

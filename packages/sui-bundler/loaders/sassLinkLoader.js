const createSassLinkLoader = entryPoints => url => {
  if (Object.keys(entryPoints).find(pkg => url.match(`${pkg}/`))) {
    const [org, name] = url.split(/\//)
    const pkg = [org.replace('~', ''), name].join('/')

    const absoluteUrl = url.replace(
      new RegExp(`~?${pkg}(\\/lib)?`, 'g'),
      entryPoints[pkg]
    )
    return {file: absoluteUrl}
  }
  return null
}

module.exports = createSassLinkLoader

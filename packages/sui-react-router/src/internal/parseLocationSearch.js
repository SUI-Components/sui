export default function parseLocationSearch({search}) {
  const decodedURI = decodeURI(search.substring(1))
  if (!decodedURI) return {}

  const jsonStringContent = decodedURI
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"')

  return JSON.parse(`{"${jsonStringContent}"}`)
}

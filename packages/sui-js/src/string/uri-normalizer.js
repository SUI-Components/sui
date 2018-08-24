export const uriNormalizer = str => {
  return str
    .toLowerCase()
    .replace(/[\s']/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

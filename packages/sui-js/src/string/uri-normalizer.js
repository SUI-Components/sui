import slugify from 'slugify'

const customCharMap = {
  "'": '_'
}
export const uriNormalizer = str => {
  slugify.extend(customCharMap)
  return slugify(str).toLowerCase()
}

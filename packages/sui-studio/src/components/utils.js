/* global __BASE_DIR__ */
const path = require('path')
const DEFAULT_LOGO =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 470 340.6'> <path fill='#e30613' d='M129.6 170.3c0-58.6 29.6-110.2 74.6-140.8L155.5 1.8c-4.2-2.4-9.3-2.3-13.5.1L6.7 81.2C2.5 83.6 0 88.1 0 92.9v156.9c0 4.8 2.6 9.2 6.8 11.6l137.4 77.5c4.2 2.3 9.4 2.3 13.6-.2l46.7-27.4c-45.2-30.6-74.9-82.3-74.9-141z' /> <path fill='#009fe3' d='M299.8.1c-35.4 0-68.3 10.8-95.6 29.4l87.7 49.8c4.2 2.4 6.8 6.8 6.8 11.6l1.1 156.8c0 4.8-2.5 9.3-6.7 11.7l-88.6 51.9c27.2 18.4 60 29.2 95.3 29.2 94 0 170.2-76.2 170.2-170.2S393.8.1 299.8.1z' /> <path fill='#000411' d='M299.8 247.7l-1.1-156.8c0-4.8-2.6-9.2-6.8-11.6l-87.7-49.8c-45 30.6-74.6 82.3-74.6 140.8 0 58.7 29.7 110.4 74.9 141l88.6-51.9c4.2-2.4 6.7-6.9 6.7-11.7z' /></svg>"

export const getComponentsList = () => {
  const reqPackages = require.context(
    `${__BASE_DIR__}/components`,
    true,
    /^\.\/\w+\/\w+\/package\.json/
  )
  return (
    reqPackages
      .keys()
      .map(k => k.replace(/\.\//, '').replace(/\/package\.json/, ''))
      .map(k => {
        const [category, component] = k.split(path.sep)
        return {category, component}
      }) || []
  )
}

export const getSuiStudioConfig = () => {
  const {config = {}} = require(`${__BASE_DIR__}/package.json`)
  return config['sui-studio'] || {}
}

export const getStudioName = () => {
  const config = getSuiStudioConfig()
  return config.name || 'SUI Components'
}

export const getStudioLogo = () => {
  const config = getSuiStudioConfig()
  return config.logo || DEFAULT_LOGO
}

export const isEmptyObject = obj => {
  for (var x in obj) {
    if (obj.hasOwnProperty(x)) {
      return false
    }
  }
  return true
}

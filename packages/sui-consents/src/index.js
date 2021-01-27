import atob from './atob'

const TCF_COOKIE_KEY = 'borosTcf'

/**
 * Extracts the cookie value from the cookie string
 * @param {string} key
 * @param {string} cookies
 */
const readCookie = (key, cookies) => {
  const re = new RegExp(key + '=([^;]+)')
  const value = re.exec(cookies)
  return value !== null ? value[1] : null
}

/**
 * @param {object} param
 * @param {string} param.cookies
 * @returns {object}
 */
const getUserConsents = ({cookies}) => {
  const cookieValue = readCookie(TCF_COOKIE_KEY, cookies)
  if (!cookieValue) return {}

  try {
    const {purpose} = JSON.parse(atob(cookieValue))
    const {consents} = purpose
    return consents
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return {}
  }
}

/**
 * @param {object} param
 * @param {array} param.requiredConsents for example [1, 3, 8]
 * @param {string} param.cookies
 * @return {boolean}
 */
export const hasUserConsents = ({requiredConsents, cookies}) => {
  const userConsents = getUserConsents({cookies})
  return requiredConsents.every(purposeId => Boolean(userConsents[purposeId]))
}

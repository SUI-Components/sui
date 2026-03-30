export function readCookie(cookieName) {
  const re = new RegExp(cookieName + '=([^;]+)')
  const value = re.exec(document.cookie)
  return value !== null ? unescape(value[1]) : null
}

/**
 * Reads the GA4 session ID directly from the cookie.
 * The cookie format is: _ga_<CONTAINER_ID>=GS1.1.<sessionId>.<timestamp>...
 *
 * @param {string} cookiePrefix - Cookie prefix configured in GA4 (e.g., 'segment')
 * @returns {string|null} The session ID or null if not found
 */
export function getGA4SessionIdFromCookie(cookiePrefix = 'segment') {
  const cookies = document.cookie.split(';')
  const sessionRegex = /\.s(\d+)/
  const searchStr = cookiePrefix ? `${cookiePrefix}_ga_` : '_ga_'

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    if (cookie.indexOf(searchStr) === 0) {
      const match = cookie.match(sessionRegex)
      if (match && match[1]) {
        return match[1]
      }
    }
  }

  return null
}

const ONE_YEAR = 31_536_000
const DEFAULT_PATH = '/'
const DEFAULT_SAME_SITE = 'Lax'
export function saveCookie(
  cookieName,
  data,
  {maxAge = ONE_YEAR, path = DEFAULT_PATH, reduceDomain = true, sameSite = DEFAULT_SAME_SITE} = {}
) {
  const domain = reduceDomain ? toCookieDomain() : window.location.hostname
  const cookieValue = [
    `${cookieName}=${data}`,
    `domain=${domain}`,
    `path=${path}`,
    `max-age=${maxAge}`,
    `SameSite=${sameSite}`
  ].join(';')
  document.cookie = cookieValue
}

export function removeCookie(
  cookieName,
  {path = DEFAULT_PATH, reduceDomain = true, sameSite = DEFAULT_SAME_SITE} = {}
) {
  const domain = reduceDomain ? toCookieDomain() : window.location.hostname
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`
}

/**
 * Reduces the domain to main domain name
 * Examples:
 *   - www.mywebpage.es -> .mywebpage.es
 *   - www.my.newwebpage.net -> .newwebpage.net
 *   - www.mywebpage.co.uk -> .mywebpage.co.uk
 *
 * @param {String} domain
 * @returns {String} dot + main domain
 */
const toCookieDomain = (domain = window.location.hostname || '') => {
  const DOT = '.'
  const hostDomainParts = domain.split(DOT).reverse()
  if (hostDomainParts.length === 1) {
    return hostDomainParts[0]
  }
  const cookieDomainParts = []
  for (const part of hostDomainParts) {
    cookieDomainParts.push(part)
    if (part.length > 3) break
  }
  return `${DOT}${cookieDomainParts.reverse().join(DOT)}`
}

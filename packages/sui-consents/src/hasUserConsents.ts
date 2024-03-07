import atob from './atob'
import {TCF_COOKIE_KEY} from './config'

/**
 * Extracts the cookie value from the cookie string
 */
const readCookie = (key: string, cookies: string): string | null => {
  const re = new RegExp(key + '=([^;]+)')
  const value = re.exec(cookies)
  return value !== null ? value[1] : null
}

const getUserConsents = ({cookies}: {cookies: string}): object => {
  const cookieValue = readCookie(TCF_COOKIE_KEY, cookies)
  if (cookieValue === null) return {}

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

export default function hasUserConsents({
  requiredConsents,
  cookies
}: {
  requiredConsents: number[]
  cookies: string
}): boolean {
  const userConsents = getUserConsents({cookies})
  return requiredConsents.every(purposeId => Boolean(userConsents[purposeId]))
}

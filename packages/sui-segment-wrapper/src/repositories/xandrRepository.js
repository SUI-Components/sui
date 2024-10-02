import {readCookie, removeCookie, saveCookie} from '../utils/cookies.js'
import {isClient, setConfig} from '../config.js'
import {USER_GDPR} from '../tcf.js'

const XANDR_ID_SERVER_URL = 'https://secure.adnxs.com/getuidj'
const XANDR_ID_COOKIE = 'adit-xandr-id'

const USER_OPTED_OUT_XANDR_ID_VALUE = 0

/**
 * [Xandr API Docs]{@link https://docs.xandr.com/bundle/invest_invest-standard/page/topics/user-id-mapping-with-getuid-and-mapuid.html}
 * @returns {String|null} a valid xandrId value
 */
export function getXandrId({gdprPrivacyValueAdvertising}) {
  if (!isClient) return null

  if (gdprPrivacyValueAdvertising !== USER_GDPR.ACCEPTED) {
    removeCookie(XANDR_ID_COOKIE)
    return null
  }

  // 0 is invalid. Negative numbers seems to be invalid too.
  const checkValid = xandrId => xandrId && Number(xandrId) > USER_OPTED_OUT_XANDR_ID_VALUE

  const storedXandrId = readCookie(XANDR_ID_COOKIE)
  const isValidXandrId = checkValid(storedXandrId)

  if (!isValidXandrId) {
    getRemoteXandrId().then(xandrId => {
      if (typeof xandrId === 'string') {
        saveCookie(XANDR_ID_COOKIE, xandrId)
      }
    })
  }
  setConfig('xandrId', storedXandrId)
  return isValidXandrId ? storedXandrId : null
}

export function getRemoteXandrId() {
  if (!isClient) return Promise.resolve(null)

  return window
    .fetch(XANDR_ID_SERVER_URL, {
      credentials: 'include'
    })
    .then(response => response.json())
    .then(json => json?.uid)
}

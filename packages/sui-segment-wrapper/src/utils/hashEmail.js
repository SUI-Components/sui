import md5 from 'tiny-hashes/md5'
import sha256 from 'tiny-hashes/sha256'

const PLUS_AND_DOT = /\.|\+.*$/g

/**
 * Normalize email by lowering case and extracting + and . symbols for gmail
 * @param {string} email
 * @return {string} Normalized email. If not valid, returns and empty string
 */
export function normalizeEmail(email) {
  if (typeof email !== 'string') return ''

  email = email.toLowerCase()
  const emailParts = email.split(/@/)

  if (emailParts.length !== 2) return ''

  let [username, domain] = emailParts
  username = username.replace(PLUS_AND_DOT, '')

  return `${username}@${domain}`
}

export function createUniversalId(email) {
  const normalizedEmail = normalizeEmail(email)
  return normalizedEmail ? sha256(normalizedEmail) : ''
}

export function hashEmail(email) {
  const normalizedEmail = normalizeEmail(email)
  return normalizedEmail ? md5(normalizedEmail) : ''
}

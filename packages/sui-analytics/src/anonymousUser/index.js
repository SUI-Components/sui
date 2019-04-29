import cookieStrategy from './cookies'
import localStorageStrategy from './localStorage'
import uuid from 'uuid/v4'

const KEY = 'sui-analytics-anonymous-user-id'

const getAnonymousUserId = function(key) {
  return (
    cookieStrategy.getItem(key) || localStorageStrategy.getItem(key) || uuid()
  )
}

const setAnonymousUserId = function(key, userId) {
  cookieStrategy.setItem(key, userId)
  localStorageStrategy.setItem(key, userId)
}

export default function(key = KEY) {
  const userId = getAnonymousUserId(key)
  setAnonymousUserId(key, userId)
  return userId
}

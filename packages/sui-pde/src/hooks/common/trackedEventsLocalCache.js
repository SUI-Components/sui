export const SESSION_STORAGE_KEY = 'sui-pde:tracked-events-cache'

const read = () => {
  const storageOutput = sessionStorage.getItem(SESSION_STORAGE_KEY)
  return JSON.parse(storageOutput)
}

const update = () => {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(trackedKeys))
}

let trackedKeys
export const trackedEventsLocalCache = {
  init: () => {
    trackedKeys = read() || {}
  },
  includes: (key, value) => {
    return trackedKeys[key] === value
  },
  includesKey: key => {
    return trackedKeys[key] !== undefined
  },
  get: key => {
    return trackedKeys[key]
  },
  push: (key, value) => {
    if (trackedKeys[key] === value) return
    trackedKeys[key] = value
    update()
  }
}

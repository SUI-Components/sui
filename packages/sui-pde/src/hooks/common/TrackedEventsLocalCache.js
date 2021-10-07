export const LOCAL_STORAGE_KEY = 'sui-pde:tracked-events-cache'

const read = () => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
}

const update = () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trackedKeys))
}

let trackedKeys
export const trackedEventsLocalCache = {
  init: () => {
    trackedKeys = read() || {}
  },
  includes: (key, value) => {
    return trackedKeys[key] === value
  },
  push: (key, value) => {
    if (trackedKeys[key] === value) return
    trackedKeys[key] = value
    update()
  }
}

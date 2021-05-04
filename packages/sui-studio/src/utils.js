export const getFromStorage = (key, defaultValue) =>
  window.sessionStorage[key] || defaultValue

export const updateOnChange = (setState, sessionKey) => nextValue => {
  window.sessionStorage.setItem(sessionKey, nextValue)
  setState(nextValue)
}

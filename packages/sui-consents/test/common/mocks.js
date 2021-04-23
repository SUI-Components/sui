const listeners = []

export function tcfApiMock(registerAction, version, listener) {
  switch (registerAction) {
    case 'addEventListener': {
      listeners.push(listener)
      break
    }
    case 'removeEventListener': {
      const listenerIndex = listeners.indexOf(listener)
      listeners.splice(listenerIndex, 1)
      break
    }
  }
}

export function triggerTcfEvent(eventObject) {
  listeners.forEach(listener => listener(eventObject))
}

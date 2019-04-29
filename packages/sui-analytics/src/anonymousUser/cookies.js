import cookie from '@s-ui/js/lib/cookie'

export default {
  getItem: key => {
    return cookie.get(key)
  },
  setItem: (key, value) => {
    cookie.set(key, value)
  }
}

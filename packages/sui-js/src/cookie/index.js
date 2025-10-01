import {parse as parseCookie} from 'cookie'
import jsCookie from 'js-cookie'

const parse = cookie => parseCookie(cookie)
const get = key => jsCookie.get(key)
const getJSON = key => jsCookie.getJSON(key)
const set = (key, val, options) => jsCookie.set(key, val, options)
const remove = (key, options) => jsCookie.remove(key, options)

const cookie = {
  parse,
  get,
  getJSON,
  set,
  remove
}

const withoutEncoding = jsCookie.withConverter({
  read: value => value,
  write: value => value
})

const cookieWithoutEncoding = {
  get: key => withoutEncoding.get(key),
  getJSON: key => withoutEncoding.getJSON(key),
  set: (key, val, opts) => withoutEncoding.set(key, val, opts),
  remove: key => withoutEncoding.remove(key)
}

export default cookie
export {cookieWithoutEncoding}

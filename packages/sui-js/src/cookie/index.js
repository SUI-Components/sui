import {parse as parseCookie} from 'cookie'
import jsCookie from 'js-cookie'

const parse = cookie => parseCookie(cookie)
const get = key => jsCookie.get(key)
const getJSON = key => jsCookie.getJSON(key)
const set = (key, val) => jsCookie.set(key, val)
const remove = key => jsCookie.remove(key)

const cookie = {
  parse,
  get,
  getJSON,
  set,
  remove
}

export default cookie

import * as events from './events'
import axios from 'axios'

const BASE_URL = 'https://api.segment.io/v1/'

export default function suiAnaylitics(writeKey) {
  const encodedWriteKey = window.btoa(`${writeKey}:`)
  const headers = {
    Authorization: `Basic ${encodedWriteKey}`,
    'Content-Type': 'application/json'
  }

  return Object.keys(events).reduce((acc, method) => {
    acc[method] = data =>
      axios.post(`${BASE_URL}${method}`, events[method](data), {
        headers
      })
    return acc
  }, {})
}

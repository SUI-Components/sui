# sui-js

> Set of useful js utilities

```sh
$ npm install @s-ui/js --save
```

## pipe

Consist of a chain of processing functions, where the output of each element is the input of next

```js
import pipe from @s-ui/js/lib/pipe

const textToUpperCase = text => text.toUpperCase()
const textToArray = text => [...text]
const title = 'Schibsted'

console.log(pipe(textToUpperCase, textToArray)(title)) // ["S", "C", "H", "I", "B", "S", "T", "E", "D"]
```

## asyncPipe

Consist of a chain of processing async and sync functions, where the output of each element is the input of next. The result is a promise.

```js
import {asyncPipe} from @s-ui/js/lib/pipe

const textToUpperCase = async text => text.toUpperCase()
const textToArray = async text => [...text]
const title = 'Schibsted'

asyncPipe(textToUpperCase, textToArray)(title).then(result => {
  console.log(result) // ["S", "C", "H", "I", "B", "S", "T", "E", "D"]
})
```

## cookie

Parse, get and set cookies. Returns an object `cookie` with `parse`, `get` and `set` methods.

**Note:** `set` method does not work on server side.

```js
import cookie from '@s-ui/js/lib/cookie'

// Parse
const {parse} = cookie
domain.config('cookie', parse(cookies))

// Get
const {get: getCookie} = cookie
const smartBannerCookie = getCookie('smartbanner')

// Set
const {set: setCookie} = cookie
const setSmartBannerCookie = setCookie('smartbanner', 1, {expires: 7, path: ''})
```

## events

Creates an event and dispatches it

```js
import {dispatchEvent} from '@s-ui/js/lib/events'

dispatchEvent({
  eventName: 'NAME_OF_THE_EVENT_TO_DISPATCH',
  detail: {
    parameter_one: 'one',
    anotherParameter: 2
  }
})
```

## function

Creates a debounced function that delays invoking func until after wait milliseconds have elapsed since the last time the debounced function was invoked.

Arguments
func (Function): The function to debounce.
[wait=0](number): The number of milliseconds to delay.
[options={}](Object): The options object.
[options.leading=false](boolean): Specify invoking on the leading edge of the timeout.
[options.maxWait](number): The maximum time func is allowed to be delayed before it's invoked.
[options.trailing=true](boolean): Specify invoking on the trailing edge of the timeout.

Returns
(Function): Returns the new debounced function.

```js
import {debounce} from '@s-ui/js/lib/function'

const callback = debounce(() => {}, 300)
```

## hash

Creates an insecure, but with pretty low collisions, hash based on MD5. Returns a string with the hash.

```js
import {createHash} from '@s-ui/js/lib/hash'

const stringToHash = 'This is the string that we will hash'
const md5Hash = createHash(stringToHash)

console.log(md5Hash) // f97ed77ff4770b7d8f0a018223823d3b
```

## string

A bunch of string utilities: remove accents, parse query strings...

```js
import {removeAccents, hasAccents} from '@s-ui/js/lib/string'

console.log(removeAccents('París')) // "Paris"
console.log(hasAccents('Árbol')) // true
```

```js
import {parseQueryString} from '@s-ui/js/lib/string'

console.log(parseQueryString('?targetPage=pta')) // {targetPage: "pta"}
console.log(parseQueryString('?makeIds[0]=123&makeIds[2]=456')) // {makeIds: ["123", "456"]}

// example with allowSparse option
const query = '?makeIds[0]=123&makeIds[2]=456'
const options = {allowSparse: true}
const parsedQueryString = parseQueryString(query, options)
console.log(parsedQueryString) // {makeIds: ["123", undefined, "456"]}
```

```js
import {fromArrayToCommaQueryString} from '@s-ui/js/lib/string'

console.log(
  fromArrayToCommaQueryString({userId: 1, adId: 2, products: [3, 4, 5]})
) // 'userId=1&adId=2&products=3,4,5'
```

```js
import {htmlStringToReactElement} from '@s-ui/js/lib/string'

htmlStringToReactElement('<p>No more dangerouslySetInnerHTML</p>')
```

```js
import {getRandomString} from '@s-ui/js/lib/string'

const randomStringLength = 6
const randomString = getRandomString(randomStringLength)
console.log(randomString.length) // log = 6 || 15 by default
console.log(randomString) // qwerty
```

```js
import {toQueryString} from '@s-ui/js/lib/string'

// example without setting encode option
const queryParams = {a: 1, b: 'lorem/ipsum', m: [1, 2]}
const options = {arrayFormat: 'repeat', delimiter: ':'}
const queryString = toQueryString(queryParams, options)
console.log(queryString) // 'a%3D1%3Ab%3Dlorem%2Fipsum%3Am%3D1%3Am%3D2'

// example with encode option
const queryParams = {a: 1, b: 'lorem/ipsum', m: [1, 2]}
const options = {encode: false}
const queryString = toQueryString(queryParams, options)
console.log(queryString) // 'a=1&b=lorem/ipsum&m=1,2'

// example with addQueryPrefix option
const queryParams = {a: 1, b: 2}
const options = {addQueryPrefix: true}
const queryString = toQueryString(queryParams, options)
console.log(queryString) // '?a=1&b=2'

// example with skipNulls option
const queryParams = {a: 1, b: null}
const options = {skipNulls: true}
const queryString = toQueryString(queryParams, options)
console.log(queryString) // 'a=1'
```

```js
import {highlightText} from '@s-ui/js/lib/string'

const highlightedText = highlightText({
  value: 'Cádiz',
  query: 'ca',
  startTag: '<strong>',
  endTag: '</strong>'
}) // "<strong>Cá</strong>diz
```

## ua-parser

A user agent parser. Returns an object `stats`

```text
{
  browserName: <string>,
  browserVersion: <string>,
  isMobile: <boolean>,
  isTablet: <boolean>,
  osName: <string>
}
```

```js
import {stats} from '@s-ui/js/lib/ua-parser'
const {isMobile, osName} = stats(userAgent)
domain.config('isMobile', isMobile) // bool
domain.config('osName', osName) // string
```

## classes

Utilities to easily format classNames following the current convention for component-{children}-element--modifier

```js
import {suitClass} from '@s-ui/js/lib/classes'
const baseComponent = suitClass('baseComponent')
const childrenComponent = baseComponent({children: 'childrenComponent'})

const className = childrenComponent({element: 'element', modifier: 'modifier'}) // outputs: baseComponent-childrenComponent-element--modifier
```

## array

Utilities to manipulate arrays

```js
import {shuffle} from '@s-ui/js/lib/array'

const list = [1,2,3,4,5]

const shuffledList = shuffle(list)
console.log(shuffledList) // outputs: [3,1,4,5,2]
```

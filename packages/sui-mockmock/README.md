# sui-mockmock

> Mocking utilities for testing.

## Motivation

Centralize common solutions for common mocking concerns in JavaScript.

## Installation

```sh
npm install @s-ui/mockmock --save-dev
```

## Available mockers

### http

Mocks `http` requests in node and `XMLHttpRequest` requests in the browser.

#### Usage

```js
import {HttpMocker} from '@s-ui/mockmock'
import axios from 'axios'

// Mock any requests
const mocker = new HttpMocker()
mocker
  .httpMock('http://fake.api.com')
  .get('/my-service')
  .reply({property: 'value'}, 200)

// Make your requests
axios
  .get('http://fake.api.com/my-service')
  .then(response => console.log(response)) // { property: 'value' }
```

Also available for import

```js
import HttpMocker from '@s-ui/mockmock/lib/http'
```

## Details

Since this library internally constructs the url of the original and the mocked request and then compares them,
it's needed to create the mock request with the same parameter order than the original, if not, it will throw a 404.

![incorrect] The parameters of both petitions (original and mocked) don't have the same parameter order (err 404 thrown)

```js
mocker
  .httpMock(...)
  .get('/urlToAttack')
  .query({
    search: 'value of the search',
    working: false,
  })
  ...
  ...

domain
  .get('attacks_the_same_url_use_case')
  .execute({
    working: false,
    search: 'value of the search',
  })
  ...
  ...
```

![correct] The mocked and the original HTTP requests have to same parameter order

```js
mocker
  .httpMock(...)
  .get('/urlToAttack')
  .query({
    search: 'value of the search',
    working: true,
  })
  ...
  ...

domain
  .get('attacks_the_same_url_use_case')
  .execute({
    search: 'value of the search',
    working: true,
  })
  ...
  ...
```

[correct]: https://img.shields.io/badge/-OK-green.svg
[incorrect]: https://img.shields.io/badge/-KO-red.svg

## Clean up state

It is important to clean tests before and after so you have a initial state **non dependent**.

Why? Sharing mutable state between components it is a bad idea.

- One tests depends on the others, so you can not run one test in isolation.
- If you refactor one test, you might break all the others tests, because all tests are part of a chain of actions.
- If tests are isolated you can: **paralelize** test and **remove** or **add** tests without breaking other ones

Example:

```js

describe('abc', () => {
  beforeEach(() => {
    mocker.create()
  })
  afterEach(() => {
    mocker.restore()
  })
  ...
  it('xyz', () =>{
    ...
  })
})

```

## Mocking Requests

The `.reply(response, statusCode, headers)` method causes the 'fake' server to respond to any request not matched by another response with the provided data.

```js
mocker
  .httpMock(...)
  .get('/urlToAttack')
  .query({
    search: 'value of the search',
    working: true,
  })
  .reply('{status: "ok"}', 200, {'Access-Control-Allow-Credentials': true})
  ...
  ...

const response = domain
  .get('attacks_the_same_url_use_case')
  .execute({
    search: 'value of the search',
    working: true,
  })

expect(response.data.status).to.equal('ok')
```

## Retriving Requests

If you want to test what your use_case, function, etc is doing, probably you will need to check that based on the arguments provided to the function are transformed and as an output or side effect one or various `requests` are done will a certain `url`, `body`, or `headers`.

The `.requestNTH(index)` method returns the nth `request` mocked by the fake server so you can assert things like:

- The content of the `body` of the request is the one expected.
- The `headers` of the request are the expected.
- The `url` of the request is the one expected.
- The order of the `requests` is the correct one.

```js
mocker
  .httpMock(...)
  .get('/urlToAttack')
  .query({
    search: 'value of the search',
    working: true,
  })
  .reply('{status: "ok"}', 200, {'Access-Control-Allow-Credentials': true})
  ...
  ...

const response = domain
  .get('attacks_the_same_url_use_case')
  .execute({
    search: 'value of the search',
    working: true,
  })

const request = mock.requestNTH(0)
expect(request.body).to.be.equal('year=2030&doors=3&color=blue')
expect(request.url).to.be.equal('https://.../urlToAttack')
...
```

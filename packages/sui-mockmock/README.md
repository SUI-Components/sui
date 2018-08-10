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

####  Usage

```js
import {HttpMocker} from '@s-ui/mockmock'
import axios from 'axios'

// Mock any requests
const mocker = new HttpMocker()
mocker
  .httpMock('http://fake.api.com')
  .get('/my-service')
  .reply({ property: 'value' }, 200)

// Make your requests
axios
  .get('http://fake.api.com/my-service')
  .then((response) => console.log(response)) // { property: 'value' }

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

[correct]:https://img.shields.io/badge/-OK-green.svg
[incorrect]:https://img.shields.io/badge/-KO-red.svg
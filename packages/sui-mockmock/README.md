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
# @s-ui/react-head

> Populate the head element of your React app without hassle.

Features:

- Change the `<head>` content by using React components.
- Add attributes to `<body>` and `<html>` tags.

## Installation

```sh
$ npm install @s-ui/react-head
```

## How to use

### Client Side Setup

```js
import React from 'react'
import { HeadProvider, Title, Link, Meta }, Head from 'react-head'

const App = () => (
  <HeadProvider>
    <section className="Home">
      { /* Using new way */ } 
      <Title>Title of page</Title>
      <Link rel="canonical" content="http://jeremygayed.com/" />
      <Meta name="example" content="whatever" />

      { /* Using compatible version */ }
      <Head
        bodyAttributes={{ class: 'search full-Width' }}
        htmlAttributes={{ lang: 'es-ES' }}
        link={[{ rel: 'canonical', href:'https://canonical.com' }]}
        meta={[{ name: 'description', content: 'The description' }]}
        title="Title of page"
        />
    </section>
  </HeadProvider>
)
```

### Server Side Setup

```js
import {HeadProvider} from '@s-ui/react-head'
import {renderHeadTagsToString} from '@s-ui/react-head/lib/server'
import {renderToString} from 'react-dom/server'
// headTags will be mutated, so you need to create a new variable
// for each request to avoid collisions
const headTags = []
const app = renderToString(
  <HeadProvider headTags={headTags}>
    <App />
  </HeadProvider>
)
// use headTags to get the content of `<head>`
// and string attributes for `<body>` and `<html>`
const {
  bodyAttributes,
  headString,
  htmlAttributes,
} = renderHeadTagsToString(headTags)

res.send(`
  <!doctype html>
    <html ${htmlAttributes}>
    <head>${headContent}</head>
    <body ${bodyAttributes}>
      <div id="root">${app}</div>
    </body>
  </html>
`)
```

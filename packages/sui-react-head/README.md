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

### Usage

Using `<Head>` component will allow you to define the tags inside the `<head>` element. You could use two different ways: using the `children` of the component with the desired tags or using the props.

```js
import React from 'react'
import Head, { HeadProvider } from '@s-ui/react-head'

const App = () => (
  <HeadProvider>
    <section className="Home">
      { /* Using tags directly */ }
      <Head>
        <title>Title of page</title>
        <link rel="canonical" content="http://jeremygayed.com/" />
        <meta name="example" content="whatever" />
      </Head>

      { /* Using props */ }
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

**Important ⚠️**: You can't mix both of them in order to define `link`, `meta` and `title` tags. The children will have precedence and overwrite if you try to combine both. However, you could still use `htmlAttributes` and `bodyAttributes` with the `children` approach.

### Server Side Setup

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

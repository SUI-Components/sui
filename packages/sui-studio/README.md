# @s-ui/studio

> Develop, maintain, and publish your React Components.

@s-ui/studio helps you develop and document isolated UI components for your projects. It provides,

- Isolated development of components
- A unified development platform
- Productivity improvement, focusing on component-development experience
- Live demos with auto-generated playgrounds
- Catalog of components generated from live demos and markdown docs.

![](./assets/sui-studio-demo.gif)

## Installation

```sh
npm install @s-ui/studio -D
```

## Getting Started

In case you want to create a new studio, check out [sui-studio-create](https://github.com/SUI-Components/sui/tree/master/packages/sui-studio-create)

Once you're in a new project, execute `sui-studio start` to start the development browser and work on your components.

## Common Workflow

### To create a new component, execute the component-scaffolding command.

```sh
$ npx sui-studio generate house window
```

### To develop the new component,

#### 1) Launch the development environment

```sh
$ npx sui-studio dev house/window
```

#### 2) Go to `http://localhost:3000`

#### 3) Commit changes using the appropiate command

First of all, stage you changes for commit with `git add` or whatever you use.

DO NOT use `git commit` directly. Instead, use:

```sh
$ npm run co
```

Add the script to your package.json

```json
{
  "scripts": {
    "co": "sui-mono commit"
  }
}
```

It will prompt a question form. The way you answer to this question form affects the way the commit's comment is built. Comments will be used later, after merging to master in order to decide what kind of change (release) is going to be applied (minor or major).

Then just push your changes using `git push` and merge them into master after review.

#### 4) Release

Select master branch. First, check that the release will be properly built by executing,

```
$ sui-mono check-release
```

If the output is the expected one, then run:

```
$ sui-mono release
```

## CLI

### `$ sui-studio start`

Launch a development environment where you can see all your components at once. If there are too many components, use the `dev` command.

### `$ sui-studio build`

Build a static version of a web app aimed to be deployed, where you will be able to interact with all components. The interface will be the same you use for the start command, only this one is optimized for production.

#### Options

- **`-O, --only-changes`**: only build changed components or demos
- **`-B, --before-build <command>`**: command to be executed before the build (not working with multiple commands like `npx sui-mono phoenix && npx sui-lint js`, try to group them into just one: `npm run before_build`, for example)

#### Examples

```bash
# run the build for all components
npx sui-studio build
```

```bash
# run the build just for changed components on a PR and also execute whatever you want before the build (phoenix, lint...)
GITHUB_PULL_REQUEST=123 npx sui-studio build --only-changes --before-build="npx sui-mono phoenix"
```

### `$ sui-studio dev`

Launch a development environment where you can work in total isolation on your component.

### `$ sui-studio test`

Launch all project tests in a karma browser.

## Testing

Test the studio's components both in the demo as in the development environment. _Currently in experimental mode_

Here's an example of what could go inside `test/[category]/[component]/index.js`:

```js
/* eslint react/jsx-no-undef:0 */
/* global AtomButton */

import chai, {expect} from 'chai'
import chaiDOM from 'chai-dom'
import {render} from '@testing-library/react'

chai.use(chaiDOM)

describe('AtomButton', () => {
  it('Render', () => {
    const {getByRole} = render(<AtomButton>HOLA</AtomButton>)
    expect(getByRole('button')).to.have.text('HOLA')
  })
})
```

The component will be a global object when running tests, so it is PARAMOUNT NOT to import it. In order to avoid problems with the linter, add relevant comments, as in the example above.

### How works with different SUI contexts

If there is a `demo/context.js` file where you define several SUI contexts for your components. You have to apply a patch to Mocha to allow setup describe by context. This allows you to have a "contextify" version of your component, for the context selected.

First, you have to import the patcher to create the `context` object, inside the `describe` object

```js
import '@s-ui/studio/src/patcher-mocha'
```

After that, you can use the `describe.context` object to has a key by every context definition in your `demo/context.js` file.

For example, if your context.js file looks like:

```js
export default () => {
  return Promise.resolve({
    default: {
      user: {id: 12},
      language: 'es'
    },
    other: {
      user: {id: 34},
      language: 'ca'
    }
  })
}
```

The test file should be like:

```js
import '@s-ui/studio/src/patcher-mocha'

chai.use(chaiDOM)

describe.context.default('atom/button', AtomButton => {
  it('Render', () => {
    const {getByText} = render(<AtomButton>HOLA</AtomButton>)
    expect(getByText('HOLA')).to.have.text('HOLA 12')
  })
})

describe.context.other('atom/button', AtomButton => {
  it('Render', () => {
    const {getByText} = render(<AtomButton>HOLA</AtomButton>)
    expect(getByText('HOLA')).to.have.text('HOLA 34')
  })
})
```

### How works with other context (Not SUI Context)

Each test has a `setupEnvironment` function in global scope. This function works equal to React Testing Library (RTL) `render` method but has two wrapped features:

- It uses a container to isolate the tested component.
- It has a `contexts` render option in order to pass an array of contexts providers to be wrapped.

An example could be:

```js
const ComponentWithContext = () => {
  const value = useContext(ThemeContext)
  return <p>{value}</p>
}
const setup = setupEnvironment(ComponentWithContext, {
  contexts: [
    {
      provider: ThemeContext.Provider,
      value: 'dark'
    }
  ],
  wrapper: ({children}) => (
    <div>
      <p>Hello</p>
      {children}
    </div>
  )
})
```

You can see RTL render options documentation [here](https://testing-library.com/docs/react-testing-library/api/#render-options)

### Known issue: Test a memoized component

If a component is exported wrapped memoized: `export default React.memo(Component)`, it loses the displayName and sui-test dispatch an Error because it couldn't find the component.

If you need to make a test using a memoized component, just wrap it like:

```js
const Component = React.memo(() => <></>)
Component.displayName = 'Component'

export default Component
```

or

```js
const Component = () => <></>
Component.displayName = 'Component'

const MemoComponent = React.memo(Component)
MemoComponent.displayName = 'MemoComponent'

export default MemoComponent
```

## CLI testing integration

@s-ui/studio provides tools for running your entire component tests of your project on a karma browser

Add this scripts on your own components project

```
// package.json
{
  ...
  scripts: {
    ...
	test: "sui-studio test"
	test:watch: "sui-studio test --watch"
    ...
  }
  ...
}
```

## File structure

@s-ui/studio profusely uses the concept of "convention over configuration" for file structure.

```
├── components
│   ├── README.md
│   └── atom                             <- Component's category
│       ├── button                       <- Component's name
│       │   ├── README.md
│       │   ├── package.json
│       │   ├── src
│       │   │   ├── index.js
│       │   │   └── index.scss
│       │   ├── demo
│       │   │   ├── context.js
│       │   │   ├── playground             <- Basic code that will be shown in the component's demo
│       │   │   └── themes                 <- SASS files stored in this folder will be themes shown on the interface
│       │   │       └── myStudioTheme.scss
│       │   └── test
│       │       └── index.js              <- File containing all component's tests
│       └── header
│           ├── README.md
│           ├── package.json
│           ├── src
│           │   ├── index.js
│           │   └── index.scss
│           ├── demo                   <- Create a `demo` folder to put an demo app of your component (playground will be ignored)
│           │   ├── index.js
│           │   ├── index.scss
│           │   └── package.json
│           └── test
│               └── index.js
└── package.json
```

# Conventions

## Naming

lowerCamelCase is the choice for directories and files.

```
components/house/mainWindow/...
```

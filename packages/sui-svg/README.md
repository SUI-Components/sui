# sui-svg

> Converts your SVG files into React Components wrapped with [@s-ui/atom-icon](https://sui-components.now.sh/workbench/atom/icon/demo).

Features:
- Building the components
- Showing up a demo locally

## Installation

```sh
$ npm i -SE @s-ui/svg
```

## Usage

Add bundling scripts to your **package.json**

```json
{
  "name": "my-awesome-package",
  "version": "1.0.0",
  "scripts": {
    "prepare": "sui-svg build",
    "start": "npm run prepare && sui-svg demo"
  }
}
```

## Expected folder structure

A `src` folder with all the `.svg` files to be converted inside.

## Output

A `lib` folder with the generated components will be created/overridden.

**⚠️ Advice:** no `index.js` will be generated inside the lib folder, each component should be imported independently for performance reasons.

## How to use the generated lib

```jsx
import YourIcon from 'your-svg-repo/lib/YourIcon'

const YourAwesomeComponent = () =>
  <div>
    <YourIcon />
    <p>Awesome text/<p>
  </div>
```

Also, keep in mind, you need to import the needed styles for the icons at least once in your app:

```scss
@import "your-svg-repo/lib/index";
```

## Template

Every icon svg will be wrapped using an `<AtomIcon>` that means you could use [all the props accepted by the component](https://sui-components.now.sh/workbench/atom/icon/documentation/api).

The wrapped code is minimal, in order to avoid performance penalties. You could check it [here](templates/).

# sui-svg

> Converts your SVG files into React Components

Features:

- CLI for building the components
- CLI for showing up a demo locally

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
    "build": "sui-svg build",
    "start": "npm run build && sui-svg demo"
  }
}
```

## Expected folder structure

A `src` folder with all the `.svg` files to be converted inside

## Output

A `lib` folder with the generated components will be created/overridden

**Advice:** no `index.js` will be generated inside the lib folder, each component should be imported independently for performance reasons

# sui-studio
> Develop, maintain and publish your SUI components.


Sui Studio helps you to develop and document isolated UI components for your projects. It provides:

* Isolated development of components
* Unified development platform
* Productivity improvement focusing of component development experience
* Live Demos as a base of work (with auto-generated playgrounds)
* Components discovery catalog generated from live demos and markdown docs.

![](./assets/sui-studio-demo.gif)

## Installation

```sh
npm install @s-ui/studio
```

## Getting Started

In case you want to create a new studio, check out [sui-studio-create](https://github.com/SUI-Components/sui/tree/master/packages/sui-studio-create)

Once you're in the new project, you can execute `sui-studio start` in order to start the development browser and start working on your components.

## Common Workflow

### Creating a new component
#### 1) Create a component

```sh
$ npx sui-studio generate house window
```

### Desarrolla el nuevo componente
#### 2) Levanta el entorno de desarrollo
```sh
$ npx sui-studio dev house/window
```

#### 3) Abre tu browser a `http://localhost:3000`

#### 4) Commit changes using the appropiate command

First of all, stage you changes for commit with ```git add``` or whatever you use.

DO NOT use ```git commit``` directly. Instead, use:

```sh
$ npm run co
```

Add the script to your package.json

```json
{
  "scripts": {
    "co": "sui-studio commit"
  }
}
```

It will prompt a question form. The way you answer to this question form affects the way the commit's comment is built. Comments will be used later, after merging to master in order to decide what kind of change (release) is going to be done (minor or major).

Then just push your changes using ```git push``` and merge them into master after review.

#### 4) Release

Select master branch. First, check that the release will be properly built by executing:
```
$ sui-studio check-release
```
If the output is the expected then run:
```
$ sui-studio release
```

## CLI

### `$ sui-studio start`

También levanta un entorno de desarrollo donde podrás ver todos tus componente a la vez. Si tienes demasiados componentes es aconsejable usar el comando `dev`.

### `sui-studio build`

Contruye una versión estática y pensada para ser deployada de una aplicación donde vas a poder interacturar con todos los componentes. La interfaz, será la misma que cuando usas el comando start
pero optimizada para ser puesta en producción.

### `$ sui-studio dev`

Levanta un entorno de desarrollo donde puedes trabajar en tu componente de forma totalmente aislada.

## Testing

Ahora es posible testear los componentes del studio. Tanto en la demo general como en el entorno de desarrollo. *Actualmente está en modo experimental*

Todos los comandos anteriores soportan el flag `--experimental-test`. Solo usando ese flag podrás ver los tests en la interfaz del estudio.

> Si usas el flag con el comando `dev` y no tienes el fichero de test en `test/[category]/[component]/index.js` el comando fallará.

```
/* eslint react/jsx-no-undef:0 */
/* global AtomButton */

import React from 'react'

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

El componente será un objeto global a la hora de correr los test, por lo que es MUY IMPORTANTE que no lo importes. Para evitar problemas con el linter, puedes agregar
los comentarios adecuados como en el ejemplo.


## Estructura de Ficheros

SUIStudio usa extensivamente el concepto de configuración bajo convenio, para indicarle como queremos relacionarnos con la aplicación. Sobre es especialmente importante la estructura de ficheros.

```
.
├── components
│   ├── README.md
│   └── atom                                <- Esta es la categoría del componente
│       ├── button                          <- Este es el nombre del componente
│       │   ├── README.md
│       │   ├── package.json
│       │   └── src
│       │       ├── index.js
│       │       └── index.scss
│       └── header
│           ├── README.md
│           ├── package.json
│           └── src
│               ├── index.js
│               └── index.scss
├── demo
│   └── atom
│       ├── button
│       │   ├── context.js
│       │   ├── playground                <- Código básico que quieres mostrar en la demo del componente
│       │   └── themes                    <- Todos los ficheros sass dentro de esta carpeta serán temas a motrar en la interfaz
│       │       └── myStudioTheme.scss
│       └── header
│           └── demo                      <- Cuando el playground se queda corto, pues crear esta carpeta `demo` para crear una "aplicación" donde puedes hacer requires.
│               ├── index.js
│               ├── index.scss
│               └── package.json
├── package.json
└── test
    └── atom
        ├── button
        │   └── index.js                 <- Este es el fichero que contiene los tests de ese componente.
        └── header
            └── index.js
```

# Conventions

## Naming
lowerCamelCase is the choice for directories and files.
```
components/house/mainWindow/...
```

# sui-bunder
> Config-free bundler for ES6 React apps.

Features:
* Simple CLI for prod and dev environment
* Unique solution for bundling; no boilerplate, no config.
* Remote improvements inherited transparently (ej: monitoring, PWA, etc)
xw

## Installation

```sh
$ npm install @schibstedspain/sui-bundler --save-dev
```

## Usage

Add bundling scripts to your **package.json**

```json
{
  "name": "my-awesome-package",
  "version": "1.0.0",
  "scripts": {
    "build": "sui-bundler build -C",
    "start": "sui-bundler dev"
  }
}
```

## Requirements

### Use node v6

### Folder structure

Refer to [example folder](./example) to see what's expected, which is basically:

```
├── package.json
└── src
    ├── index.html
    └── app.js
```

With `index.html` as app home and`app.js` as entry point.

## CLI

### Desarrollo
Durante el desarrollo de la aplicación tendrás hot module reload y browserstack. Podrás encontrarlo en `localhost:3000`
```
$ sui-bundler dev
```

### Producción
Dentro de la carpeta `public` están los estáticos listos para ser deployados a producción.

```
$ sui-bundler build
```

Si deseas borrar la carpeta public antes de generar los nuevos estáticos, usa el flag `--clean | -C`

## Vendors / Envs

Si no quieres no tienes por que usar ninguna configuración, pero si deseas optimizar tus estáticos, puedes usar la siguiente configuración dentro de tu package.json

```json
{
  "sui-bundler": {
    "env": ["APP_NAME", ["USER", "DEFAULT_VALUE"]],
    "vendor": ["react", "react-dom"],
    "cdn": "https://url_to_me_cdn.com/",
    "alias": {"react": "preact"},
    "offline": true,
    "externals": {
      "jquery": "./node_modules/jquery/jquery.min.js"
    }
  }
}
```

> La url al CDN **DEBE** acabar con un `/` final

Cualquier variable de entorno, la tendrás disponible en tu fichero index.html mediante en `htmlWebpackPlugin.options.env`

```
<html data-env="<%= htmlWebpackPlugin.options.env.NODE_ENV || 'development' %>">
```
## Offline

Esta desactivado por defecto. Para activarlo, tienes que poner `offline: true` en la configuración del sui-bundler de tu proyecto.

En el punto de entrada de tu apliación debes registrar el serviceWorker con el siguiente snippet:

```js
import {register, unregister} from '@schibstedspain/sui-bundler/registerServiceWorker'
register({
  first: () => window.alert('Content is cached for offline use.'),
  renovate: () => window.alert('New content is available; please refresh.')
})()
```

debes propocionar un hadler para cuando se cachea por primera vez contenido y otro para cuando hay nuevo contenido cacheado y tienes que refrescar la página para poder disfrutarlo.

Si estas usando Firebase, es recomendable no cachear en absoluto el fichero serviceWorker.js agregando esta configuración al fichero `firebase.json`

```json
{
  "hosting": {
    "headers": [{
      "source" : "/service-worker.js",
      "headers" : [ {
        "key" : "Cache-Control",
        "value" : "no-cache"
      }]
    }]
  }
}
```

Si deseas dar de baja tu service worker solo tienes que reemplazar tu llamada a register por `unregister`

### Caching

Puedes configurar que quieres cachear para ser usado offline:

```js
"offline": {
  whitelist: ["::all::"]
  "runtime": [{
    "urlPattern": "ms-mt--api-web\\.spain\\.schibsted\\.io",
    "handler": "networkFirst"
  },{
    "urlPattern": "fonts\\.googleapis\\.com",
    "handler": "fastest"
  },{
    "urlPattern": "prea\\.ccdn\\.es\/cnet\/contents\/media",
    "handler": "cacheFirst",
    "options": {
      "cache": {
        "name": "image-cache",
        "maxEntries": 50
      }
  }}]
}
```

runtime usa la mismo API que (sw-toolbox)[https://googlechrome.github.io/sw-toolbox/]

además whitelist es un listado de regexp que indican que páginas son seguras para hacer solo CSR. Puedes usar el string `::all::` para indicar que siempre quieres usar CSR.

Si no defines un listado whitelist. Siempre se hará SSR

## Externals

Cumple la función de subir una librería external a tu proyecto que normalmente lo pondrías a mano con su propio tag script, a tu cdn, y colocar una referencia a el en index.html y con un hash que representa el contenido del fichero.

## Hot Module Replacement - React
Lo tienes todo preparado para poder usarlo en tus proyectos de react.
Solo tienes que aplicar estas instrucciones en tu `app.js` https://webpack.js.org/guides/hmr-react/#code

## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

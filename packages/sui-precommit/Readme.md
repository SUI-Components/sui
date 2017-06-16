# sui-precommit

Este paquete instala un precommit (GIT) que pasa las tareas de linting para JS y para Sass. Además agrega tres nuevas tareas al paquete de NPM.

El paquete de NPM de tu proyecto una vez instalado quedará así:

```
{
  "name": "test1",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint:js": "sui-lint js",
    "lint:sass": "sui-lint sass",
    "lint": "npm run lint:js && npm run lint:sass"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "pre-commit": [
    "lint",
    "test"
  ],
  "devDependencies": {
    "@schibstedspain/sui-precommit": "1"
  }
}
```

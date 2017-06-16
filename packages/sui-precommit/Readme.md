# Frontend pre commit rules

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
    "lint:js": "linting-rules js",
    "lint:sass": "linting-rules sass",
    "lint": "npm run lint:js && npm run lint:sass"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "pre-commit": [
    "lint",
    "test"
  ],
  "devDependencies": {
    "@schibstedspain/frontend-pre-commit-rules": "8"
  }
}
```

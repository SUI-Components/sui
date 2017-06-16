# sui-lint

## CLI
Al instalar este paquete tienes un nuevo comando para poder aplicar las reglas de linting a tus ficheros JS/Sass según el convenio de Schibsted Spain.

Para ficheros JS:

```
$ sui-lint js [options]
```

Puedes pasarle más misma opciones que acepta `eslint`. Con la única diferencia que no puedes pasar una nueva configuración ya que está fijada a la nuestra.
Por defecto va a buscar todos los ficheros `js|jsx` desde el root de tu proyecto excluyendo las carpetas `lib|dist`

Para ficheros Sass:

```
$ sui-lint sass [options]
```

Al igual que en el caso anterior no puedes pasar una nueva configuración, y las carpetas ignoradas son también `lib|dist`

## Como hago funcionar mi editor con estas reglas:

1.- Instala el plugin de eslint/sassLint adecuado para tu editor.

2.- Agregar a tu package json estas lineas:

```json
{
  "eslintConfig": {
     "extends": ["./node_modules/@schibstedspain/sui-lint/eslintrc.js"]},
  "sasslintConfig": "./node_modules/@schibstedspain/sui-lint/sass-lint.yml"
}
```

## Example package.json

```json
{
  "name": "test-project",
  "version": "1.0.0",
  "scripts": {
    "lint": "npm run lint:js && npm run lint:sass",
    "lint:js": "sui-lint js",
    "lint:sass": "sui-lint sass"
  },
  "devDependencies": {
    "@schibstedspain/sui-lint": "1.0.0-beta.1"
  },
  "eslintConfig": { "extends": ["./node_modules/@schibstedspain/sui-lint/eslintrc.js"]},
  "sasslintConfig": "./node_modules/@schibstedspain/sui-lint/sass-lint.yml"
}
```

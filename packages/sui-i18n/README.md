# sui-i18n

> Isomorphic i18n service for browser and node.

The goal is to link your own I18N solution to SUI-\* components.

It provides:

- Isomorphic simple solution for i18n.
- Decoupled from React

I18N is not a ReactJS problem, thus, one should not add another component solely dedicated to translation. Instead, literals within components will be the argument of a function such as the following:

```js
i18n.t(`This is a literal to be translated`)
```

The output of this call will depend both on the adapter and on the dictionary that you had previously loaded on the library. So you will internationalize your components without worrying which I18N library your client is using.

## Installation

### npm

```javascript
$ npm install @s-ui/i18n

```

## Usage

@s-ui/i18n would also work perfectly with AngularJS or Backbone. All you need to do is set your I18N library adapter to @s-ui/i18n and then load the literals dictionary. Currently there is only one adapter for Airbnb’s I18N library, [Polyglot] (https://github.com/airbnb/polyglot.js). It’d be great to see new pull requests with new adapters. You may think about it as a sort of [consolidate](https://github.com/tj/consolidate.js/) for I18N libraries.

#### Loading the library and the adapter

```javascript
import I18n from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'

const i18n = new I18n({adapter: new Polyglot()})
i18n.languages = {
  'es-ES': {
    HELLO_WORLD: '¡Hola mundo!',
    PLURAL: 'uno |||| varios',
    PLURAL_WITH_VARIABLE: '%{houses} casa |||| %{houses} casas'
  },
  'ca-ES': {
    HELLO_WORLD: 'Hola món!',
    PLURAL: 'un |||| diversos',
    PLURAL_WITH_VARIABLE: '%{houses} casa |||| %{houses} cases'
  }
}

i18n.culture = 'es-ES'
i18n.t('HELLO_WORLD') //=> ¡Hola mundo!
i18n.t('PLURAL', 1) //=> uno
i18n.t('PLURAL', 2) //=> varios
i18n.t('PLURAL_WITH_VARIABLE', {houses: 1}) //=> 1 casa
i18n.t('PLURAL_WITH_VARIABLE', {houses: 2}) //=> 2 casas

i18n.n(1000) //=> 1.000
i18n.n(1000000) //=> 1.000.000
i18n.f('phone', '123123123') //=> '123 123 123'
```

From now on, the library will use Polyglot to translate your literals anywhere in your app.

### I18n.prototype.t vs I18n.prototype.interpolate

By default, the `I18n.prototype.t` method should always be your first choice when retrieving translations. It already comes with many features such as interpolating placeholders with static values.

```js
i18n.t('HELLO_WORLD') //=> ¡Hola mundo!
i18n.t('PLURAL', 1) //=> uno
i18n.t('PLURAL', 2) //=> varios
i18n.t('PLURAL_WITH_VARIABLE', {houses: 1}) //=> 1 casa
i18n.t('PLURAL_WITH_VARIABLE', {houses: 2}) //=> 2 casas
```

However, in some exceptional cases we may want to parse our translations with a stronger interpolation algorithm. For instance, we may want to collect some text between specific boundaries, and we want to return a specific result for that specific chunk of text.

A typical use case is when a literal contains special styles or transformation in a React component, like an anchor tag in the middle of the text or anything else that would require enhance a portion of text.

`I18n.prototype.interpolate` has all the features of `I18n.prototype.t` and provide the additional flexibility of collecting the children content between boundaries, so that we can return the desired value.

It **DOES NOT** return a string anymore, instead it'll give back an array of chunks.

The placeholder for interpolating boundaries is different from the one for static values, you'll need to wrap your content between `%[key]children[key]%`, for example:

```text
SIMPLE_BOUNDARY: 'Your name is %[upper]Spike[upper]%, the best superhero!'
```

The parser supports:

- Multiple sequential groups.
- Nested interpolation

```javascript
import I18n from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'

const i18n = new I18n({adapter: new Polyglot()})
i18n.languages = {
  'en-GB': {
    SIMPLE_BOUNDARY: 'Your name is %[upper]Spike[upper]%, the best superhero!',
    SIMPLE_BOUNDARY_PLACEHOLDER:
      '%{name}, your name is %[upper]%{name}[upper]%!',
    MULTIPLE_BOUNDARY:
      '%[upper]%{name}[upper]%, your name is %[upper]%{name}[upper]%!',
    NESTED_PLACEHOLDERS:
      'Hello, this is an %[bold]important %[link]resource[link]%[bold]% for this page!'
  }
}

i18n.culture = 'es-ES'
i18n.interpolate('SIMPLE_BOUNDARY', {
  name: 'Spike',
  upper: ({children}) => children.toUpperCase()
}) //=> ['Spike, your name is ', 'SPIKE', ', the best superhero!']
i18n.interpolate('SIMPLE_BOUNDARY_PLACEHOLDER', {
  name: 'Spike',
  upper: ({children}) => children.toUpperCase()
}) //=> ['Spike, your name is ', 'SPIKE', '!']
i18n.interpolate('MULTIPLE_BOUNDARY', {
  name: 'Spike',
  upper: ({children}) => children.toUpperCase()
}) //=> ['SPIKE', ', your name is ', 'SPIKE', '!']
i18n.interpolate('NESTED_PLACEHOLDERS', {
  bold: ({children}) => <strong>{children}</strong>,
  link: ({children}) => <a>{children}</a>
}) //=> ['Hello, this is an ', <strong>['important ', <a>resource</a>]</strong>,' for this page!']
```

#### React usage

The `I18n.prototype.interpolate` method is particulary useful to generate React.Fragments that can be rendered inside a component.

```jsx
import I18n from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'

const i18n = new I18n({adapter: new Polyglot()})
i18n.languages = {
  'en-GB': {
    DISCLAIMER:
      'Complete cvs have %[gray]twice the change to be picked.[gray]%. Start now completing it!'
  }
}

function Component() {
  const label = i18n.interpolate(`DISCLAIMER`, {
    gray: props => <Text as="span" color={COLORS['gray-D1']} {...props} />
  })

  return <Text>{label}</Text>
}
```

### Changing the dictionary

Changing a dictionary is triggered whenever we change the application culture.

```javascript
import I18n from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'

const i18n = new I18n({adapter: new Polyglot()})
i18n.languages = {
  'es-ES': {
    HELLO_WORLD: '¡Hola mundo!'
  },
  'ca-ES': {
    HELLO_WORLD: 'Hola món!'
  },
  'en-GB': {
    HELLO_WORLD: 'Hello world!'
  }
}

i18n.culture = 'es-ES'
i18n.t('HELLO_WORLD') //=> ¡Hola mundo!
i18n.n(1000) //=> 1.000
i18n.n(1000000) //=> 1.000.000

i18n.culture = 'ca-ES'
i18n.t('HELLO_WORLD') //=> Hola món!
i18n.n(1000) //=> 1.000
i18n.n(1000000) //=> 1.000.000

i18n.culture = 'en-GB'
i18n.t('HELLO_WORLD') //=> Hello world!
i18n.n(1000) //=> 1,000
i18n.n(1000000) //=> 1,000,000
```

### Add or modify translations dynamically

You can use the method `addTranslations` to add new literals or modify existing ones given a key.

```javascript
import I18n from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'

const i18n = new I18n({adapter: new Polyglot()})
i18n.languages = {
  'es-ES': {
    HELLO_WORLD: '¡Hola mundo!'
  },
  'ca-ES': {
    HELLO_WORLD: 'Hola món!'
  },
  'en-GB': {
    HELLO_WORLD: 'Hello world!'
  }
}

i18n.culture = 'es-ES'

// You can add new translations to the current culture
const translations = {HELLO_SUI: '¡Hola desde sui!'} //  this will modify all es-ES dictionary!
i18n.addTranslations({translations})
i18n.t('HELLO_WORLD') //=> HELLO_WOLD
i18n.t('HELLO_SUI') //=> ¡Hola desde sui!

// Or specify a new culture to be set
const caTranslations = {HELLO_SUI: '¡Hola des de sui!'}
i18n.addTranslations({culture: 'ca-ES', translations: caTranslations}) // culture now is: ca-ES
i18n.t('HELLO_SUI') //=> ¡Hola des de sui!

i18n.culture = 'es-ES'

// If you specify `key`, it will add to the current dictionary
i18n.addTranslations({key: 'DYNAMIC_GREETINGS', translations})
i18n.t('HELLO_WORLD') //=> ¡Hola mundo!
i18n.t('DYNAMIC_GREETINGS.HELLO_SUI') //=> ¡Hola desde sui!
```

### Get all translations from a given key

You can use the method `getAllTranslations` to get all the translations from a given key.

```javascript
import I18n from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'

const i18n = new I18n({adapter: new Polyglot()})
i18n.languages = {
  'es-ES': {
    HELLO_WORLD: '¡Hola mundo!'
  },
  'ca-ES': {
    HELLO_WORLD: 'Hola món!'
  },
  'en-GB': {
    HELLO_WORLD: 'Hello world!'
  }
}

i18n.culture = 'es-ES'

i18n.getAllTranslations('HELLO_WORLD') //=> {'es-ES':'¡Hola mundo!', 'ca-ES': 'Hola món!', 'en-GB': 'Hello world!'}
```

### Using number formatting in the server side

If you want to take advantage of this library methods to format numbers (`i18n.n()` and `i18n.c()`) in the server side, you must implement [a polyfill for `Intl` API](http://formatjs.io/guides/runtime-environments/#server).

```javascript
var areIntlLocalesSupported = require('intl-locales-supported')

var localesMyAppSupports = [
  /* list locales here */
]

if (global.Intl) {
  // Determine if the built-in `Intl` has the locale data we need.
  if (!areIntlLocalesSupported(localesMyAppSupports)) {
    // `Intl` exists, but it doesn't have the data we need, so load the
    // polyfill and replace the constructors with need with the polyfill's.
    var IntlPolyfill = require('intl')
    Intl.NumberFormat = IntlPolyfill.NumberFormat
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
  }
} else {
  // No `Intl`, so use and load the polyfill.
  global.Intl = require('intl')
}
```

### Currency

#### Setting a currency

We can format price numbers by setting a currency in our app. Number will be formatted regarding culture and currency set.

```javascript
import I18n from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'

const i18n = new I18n({adapter: new Polyglot()})

i18n.culture = 'es-ES'
i18n.currency = 'EUR'
i18n.c(1000) //=> 1.000 €
i18n.c(1000000) //=> 1.000.000 €

i18n.culture = 'en-GB'
i18n.currency = 'GBP'
i18n.c(1000) //=> £1,000
i18n.c(1000000) //=> £1,000,000
```

#### Currency symbol

Get the currency symbol.

```javascript
import I18n from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'

const i18n = new I18n({adapter: new Polyglot()})

i18n.culture = 'es-ES'
i18n.currency = 'EUR'
i18n.currencySymbol //=> €

i18n.culture = 'en-GB'
i18n.currency = 'GBP'
i18n.currencySymbol //=> £
```

### Formatting minor types

`i18n.f` provides some formatting functionality for less frequent but still useful needs.

```js
// phone
i18n.f('phone', '123123123') //=> '123 123 123'
i18n.f('phone', '1 23 12312 3') //=> '123 123 123'
i18n.f('phone', '123123123', {separator: '-'}) //=> '123-123-123'
```

### URLs

`i18n.url` provides some funcionality for creating urls

```js
i18n.languages = {
    'es-ES': {
        "HOME": "home"
        "REDIRECT_TRUE": "?redirect=true",

    }
}
```

```js
i18n.url('/HOME') //=> 'www.example.com/home'
i18n.url('/HOME') //=> 'www.example.com/home'
i18n.url('/HOME') //=> 'www.example.com/home'
i18n.url('/HOME/REDIRECT_TRUE', true) //=> ''www.example.com/home/?redirect=true'
i18n.url('/HOME/REDIRECT_TRUE') //=> 'www.example.com/home/redirecttrue'
i18n.url('/HOME/REDIRECT_TRUE', false) //=> 'www.example.com/home/redirecttrue'
```

### Use with ReactJS

```javascript
// index.js

import I18n from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'
import withContext from '@s-ui/hoc/lib/withContext'
import App from '../app'

const i18n = new I18n({adapter: new Polyglot()})
const AppWithContext = withContext({i18n})(App)
React.render(<AppWithContext />, document.getElementById('app'))
```

### Usage Best practices

While translating and interpolating text, we could face different scenarios where using a method is a better choice compared to others.

As a golden rule, you'd prefer to always use the **i18n.t** method for translation, unless you have styles or transformations nested inside the text that requires a custom interpolation to avoid creating multiple separated strings.

Here a list of the most common use cases and the related best practice:

#### Simple text: **i18n.t** 🏆

```jsx
import I18n from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'

const i18n = new I18n({adapter: new Polyglot()})
i18n.languages = {
  'en-GB': {
    TEXT_KEY: 'Complete your data!'
  }
}

// ✅ Do
function Component() {
  const label = i18n.t(`TEXT_KEY`)

  return <Text>{label}</Text>
}

// ❌ Don't
function Component() {
  const label = i18n.interpolate(`TEXT_KEY`)

  return <Text>{label}</Text>
}
```

#### Text with placeholders: **i18n.t** 🏆

```jsx
import I18n from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'

const i18n = new I18n({adapter: new Polyglot()})
i18n.languages = {
  'en-GB': {
    TEXT_KEY: 'Hi %{name}, complete your data!'
  }
}

// ✅ Do
function Component() {
  const label = i18n.t(`TEXT_KEY`, {name: 'Spike'})

  return <Text>{label}</Text>
}

// ❌ Don't
function Component() {
  const label = i18n.interpolate(`TEXT_KEY`, {name: 'Spike'})

  return <Text>{label}</Text>
}
```

#### Text with edge boundaries: **i18n.t** 🏆

```jsx
import I18n from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'

const i18n = new I18n({adapter: new Polyglot()})

// ✅ Do
i18n.languages = {
  'en-GB': {
    TEXT_KEY: 'Hi Spike, complete your data!'
  }
}

function Component() {
  const label = i18n.t(`TEXT_KEY`)

  return <Text strong>{label}</Text>
}

// ❌ Don't
i18n.languages = {
  'en-GB': {
    TEXT_KEY: '%[bold]Hi Spike, complete your data![bold]%'
  }
}

function Component() {
  const label = i18n.interpolate(`TEXT_KEY`, {
    bold: props => <Text strong {...props} />
  })

  return label
}
```

#### Text with inner boundaries: **i18n.interpolate** 🏆

```jsx
import I18n from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'

const i18n = new I18n({adapter: new Polyglot()})

// ✅ Do
i18n.languages = {
  'en-GB': {
    TEXT_KEY: 'Hi %[bold]Spike[bold]%, complete your data!'
  }
}
function Component () {
  const label = i18n.interpolate(`TEXT_KEY`, {bold: props => <Text strong {...props} />})

  return <Text>{label}</Text>
}

// ❌ Don't
i18n.languages = {
  'en-GB': {
    START_TEXT_KEY: 'Hi '
    BOLD_TEXT_KEY: 'Spike'
    END_TEXT_KEY: ', complete your data!'
  }
}
function Component () {
  const startlabel = i18n.t(`TEXT_KEY`)
  const boldlabel = i18n.t(`TEXT_KEY`)
  const endlabel = i18n.t(`TEXT_KEY`)

  return (
    <>
      <Text>{startlabel}</Text>
      <Text strong>{boldlabel}</Text>
      <Text>{endlabel}</Text>
    </>
  )
}
```

#### Text with inner boundaries and placeholders: **i18n.interpolate** 🏆

```jsx
import I18n from '@s-ui/i18n'
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot'

const i18n = new I18n({adapter: new Polyglot()})

// ✅ Do
i18n.languages = {
  'en-GB': {
    TEXT_KEY: 'Hi %[bold]%{name}[bold]%, complete your data!'
  }
}
function Component () {
  const label = i18n.interpolate(`TEXT_KEY`, {name: 'Spike', bold: props => <Text strong {...props} />})

  return <Text>{label}</Text>
}

// ❌ Don't
i18n.languages = {
  'en-GB': {
    START_TEXT_KEY: 'Hi '
    BOLD_TEXT_KEY: '%{name}'
    END_TEXT_KEY: ', complete your data!'
  }
}
function Component () {
  const startlabel = i18n.t(`TEXT_KEY`)
  const boldlabel = i18n.t(`TEXT_KEY`, {name: 'Spike'})
  const endlabel = i18n.t(`TEXT_KEY`)

  return (
    <>
      <Text>{startlabel}</Text>
      <Text strong>{boldlabel}</Text>
      <Text>{endlabel}</Text>
    </>
  )
}
```

### Creating your own adapters

An adapter is just a Javascript object with two obligatory attributes:

- **translations** will be in charge of managing the necessary logic to load a new dictionary on your I18N library.
- **translate** is a function that gets, as a first parameter, a string with the key/literal; and, as a second parameter, an object with the values of the variables that you may need to insert.

Check out Polyglot’s [sample adapter](https://github.com/SUI-Components/sui/blob/master/packages/sui-i18n/src/adapters/default.js).

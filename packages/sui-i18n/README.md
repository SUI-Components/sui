# sui-i18n
> Isomorphic i18n service for browser and node.
 
The goal is to link your own I18N solution to SUI-* components.

It provides:
* Isomorphic simple solution for i18n.
* Decoupled from React

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
import I18n from '@s-ui/i18n';
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot';

const i18n = new I18n({adapter: new Polyglot()});
i18n.languages = {
    'es-ES': {
        'HELLO_WORLD': '¡Hola mundo!'
    },
    'ca-ES': {
        'HELLO_WORLD': 'Hola món!'
    }
};

i18n.culture = 'es-ES';
i18n.t('HELLO_WORLD') //=> ¡Hola mundo!
i18n.n(1000) //=> 1.000
i18n.n(1000000) //=> 1.000.000
i18n.f('phone', '123123123') //=> '123 123 123'
```

From now on, the library will use Polyglot to translate your literals anywhere in your app.

### Changing the dictionary

Changing a dictionary is triggered whenever we change the application culture.

```javascript
import I18n from '@s-ui/i18n';
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot';

const i18n = new I18n({adapter: new Polyglot()});
i18n.languages = {
    'es-ES': {
        'HELLO_WORLD': '¡Hola mundo!',
    },
    'ca-ES': {
        'HELLO_WORLD': 'Hola món!'
    },
    'en-GB': {
        'HELLO_WORLD': 'Hello world!'
    }
};

i18n.culture = 'es-ES';
i18n.t('HELLO_WORLD') //=> ¡Hola mundo!
i18n.n(1000) //=> 1.000
i18n.n(1000000) //=> 1.000.000

i18n.culture = 'ca-ES';
i18n.t('HELLO_WORLD') //=> Hola món!
i18n.n(1000) //=> 1.000
i18n.n(1000000) //=> 1.000.000

i18n.culture = 'en-GB';
i18n.t('HELLO_WORLD') //=> Hello world!
i18n.n(1000) //=> 1,000
i18n.n(1000000) //=> 1,000,000
```

### Using number formatting in the server side

If you want to take advantage of this library methods to format numbers (`i18n.n()` and `i18n.c()`) in the server side, you must implement [a polyfill for `Intl` API](http://formatjs.io/guides/runtime-environments/#server).

```javascript
var areIntlLocalesSupported = require('intl-locales-supported');

var localesMyAppSupports = [
    /* list locales here */
];

if (global.Intl) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported(localesMyAppSupports)) {
        // `Intl` exists, but it doesn't have the data we need, so load the
        // polyfill and replace the constructors with need with the polyfill's.
        var IntlPolyfill = require('intl');
        Intl.NumberFormat   = IntlPolyfill.NumberFormat;
        Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }
} else {
    // No `Intl`, so use and load the polyfill.
    global.Intl = require('intl');
}
```

### Currency

#### Setting a currency

We can format price numbers by setting a currency in our app. Number will be formatted regarding culture and currency set.

```javascript
import I18n from '@s-ui/i18n';
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot';

const i18n = new I18n({adapter: new Polyglot()});

i18n.culture = 'es-ES';
i18n.currency = 'EUR';
i18n.c(1000) //=> 1.000 €
i18n.c(1000000) //=> 1.000.000 €

i18n.culture = 'en-GB';
i18n.currency = 'GBP';
i18n.c(1000) //=> £1,000
i18n.c(1000000) //=> £1,000,000
```

#### Currency symbol

Get the currency symbol.

```javascript
import I18n from '@s-ui/i18n';
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot';

const i18n = new I18n({adapter: new Polyglot()});

i18n.culture = 'es-ES';
i18n.currency = 'EUR';
i18n.currencySymbol //=> €

i18n.culture = 'en-GB';
i18n.currency = 'GBP';
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

import I18n from '@s-ui/i18n';
import Polyglot from '@s-ui/i18n/lib/adapters/polyglot';
import withContext from '@s-ui/hoc/lib/withContext'
import App from '../app';

const i18n = new I18n({adapter: new Polyglot()});
const AppWithContext = withContext({i18n})(App)
React.render(
    <AppWithContext />,
    document.getElementById('app')
);
```

### Creating your own adapters

An adapter is just a Javascript object with two obligatory attributes:

* **translations** will be in charge of managing the necessary logic to load a new dictionary on your I18N library.
* **translate** is a function that gets, as a first parameter, a string with the key/literal; and, as a second parameter, an object with the values of the variables that you may need to insert.

Check out Polyglot’s [sample adapter](https://github.com/SUI-Components/sui/blob/master/packages/sui-i18n/src/adapters/default.js).

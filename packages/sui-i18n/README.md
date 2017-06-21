# sui-i18n
> Isomorphic i18n service for browser and node.

[![Sauce Test Status](https://saucelabs.com/browser-matrix/carlosvillu_rosetta.svg)](https://saucelabs.com/u/carlosvillu_rosetta)

The goal is to link your own I18N solution to SUI-* components.

It provides:
* Isomorphic simple solution for i18n.
* Decoupled from React

I18N is not a ReactJS problem, thus, one should not add another component solely dedicated to translation. Instead, literals within components will be the argument of a function such as the following:

```js
i18n.t(`This is a literal to be translated`)
```

The output of this call will depend both on the adapter and on the dictionary that you had previously loaded on Rosetta. In this way, you may internationalize your components without worrying which I18N library your client is using.


## Installation

### npm

```javascript
$ npm install @schibstedspain/rosetta

```

### Clone the repo

```
$ npm clone https://github.com/SUI-Components/rosetta
$ cd rosetta
$ npm install
$ npm run dev
```

Go to http://localhost:8080 to see the demo.

## Usage

Rosetta will also work perfectly with AngularJS or Backbone. All you need to do is set your I18N library adapter to Rosetta and then load the literals dictionary. Currently there is only one adapter for Airbnb’s I18N library, [Polyglot] (https://github.com/airbnb/polyglot.js). It’d be great to see new pull requests with new adapters. You may think about it as a sort of [consolidate](https://github.com/tj/consolidate.js/) for I18N libraries.

#### Loading the library and the adapter

```javascript
import Rosetta from '@schibstedspain/rosetta';
import Polyglot from '@schibstedspain/rosetta/lib/adapters/polyglot';

const i18n = new Rosetta({adapter: new Polyglot()});
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
```

From now on, Rosetta will use Polyglot to translate your literals anywhere in your app.

### Changing the dictionary

Changing a dictionary is triggered whenever we change the application culture.

```javascript
import Rosetta from '@schibstedspain/rosetta';
import Polyglot from '@schibstedspain/rosetta/lib/adapters/polyglot';

const i18n = new Rosetta({adapter: new Polyglot()});
i18n.languages = {
    'es-ES': {
        'HELLO_WORLD': '¡Hola mundo!'
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

If you want to take advantage of Rosseta methods to format numbers (`i18n.n()` and `i18n.c()`) in the server side, you must implement [a polyfill for `Intl` API](http://formatjs.io/guides/runtime-environments/#server).

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

### Setting a currency

We can format price numbers by setting a currency in our app. Number will be formatted regarding culture and currency set.

```javascript
import Rosetta from '@schibstedspain/rosetta';
import Polyglot from '@schibstedspain/rosetta/lib/adapters/polyglot';

const i18n = new Rosetta({adapter: new Polyglot()});

i18n.culture = 'es-ES';
i18n.currency = 'EUR';
i18n.c(1000) //=> 1.000 €
i18n.c(1000000) //=> 1.000.000 €

i18n.culture = 'en-GB';
i18n.currency = 'GBP';
i18n.c(1000) //=> £1,000
i18n.c(1000000) //=> £1,000,000
```

### Use with ReactJS

In order to simplify the use of Rosetta in combination with React, a decorator is provided that must be used in the main component of the app, and the event CHANGE_TRANSLATION_EVENT is exposed to emit it whenever our application needs to update all components when the cultures changes.

```javascript
// app.js

import React from 'react';
import Rosetta from '@schibstedspain/rosetta';
import Polyglot from '@schibstedspain/rosetta/lib/adapters/polyglot';
import {CHANGE_TRANSLATION_EVENT, rosetta} from '@schibstedspain/rosetta';

const i18n = new Rosetta({adapter: new Polyglot()});
i18n.languages = {
    'es-ES': {
        'HELLO_WORLD': '¡Hola mundo!'
    },
    'ca-ES': {
        'HELLO_WORLD': 'Hola mó n!'
    }
};

i18n.culture = 'es-ES';

@rosetta(i18n)
class App extends React.Component {
    setCulture(culture){
        i18n.culture = culture;
        i18n.emit(CHANGE_TRANSLATION_EVENT);
    }
    render(){
        <div></div>
    }
}
```

```javascript
// index.js

import Rosetta from '@schibstedspain/rosetta';
import Polyglot from '@schibstedspain/rosetta/lib/adapters/polyglot';
import App from '../app';

const i18n = new Rosetta({adapter: new Polyglot()});
const I18NApp = i18n.addToContext(App); // => Add rosetta at the context of your app

React.render( <I18NApp/ >, document.getElementById('app'));
```

### Creating your own adapters

An adapter is just a Javascript object with two obligatory attributes:

* **translations** will be in charge of managing the necessary logic to load a new dictionary on your I18N library.
* **translate** is a function that gets, as a first parameter, a string with the key/literal; and, as a second parameter, an object with the values of the variables that you may need to insert.

Check out Polyglot’s [sample adapter](https://github.com/SUI-Components/rosetta/blob/master/src/adapters/polyglot.js).

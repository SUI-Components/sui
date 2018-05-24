# Eslint detailed rules

These are the rules resulting of current configuration in `eslintrc.js`

```json
{
  "globals": {
    "Array": false,
    "ArrayBuffer": false,
    "Boolean": false,
    "constructor": false,
    "DataView": false,
    "Date": false,
    "decodeURI": false,
    "decodeURIComponent": false,
    "encodeURI": false,
    "encodeURIComponent": false,
    "Error": false,
    "escape": false,
    "eval": false,
    "EvalError": false,
    "Float32Array": false,
    "Float64Array": false,
    "Function": false,
    "hasOwnProperty": false,
    "Infinity": false,
    "Int16Array": false,
    "Int32Array": false,
    "Int8Array": false,
    "isFinite": false,
    "isNaN": false,
    "isPrototypeOf": false,
    "JSON": false,
    "Map": false,
    "Math": false,
    "NaN": false,
    "Number": false,
    "Object": false,
    "parseFloat": false,
    "parseInt": false,
    "Promise": false,
    "propertyIsEnumerable": false,
    "Proxy": false,
    "RangeError": false,
    "ReferenceError": false,
    "Reflect": false,
    "RegExp": false,
    "Set": false,
    "String": false,
    "Symbol": false,
    "SyntaxError": false,
    "toLocaleString": false,
    "toString": false,
    "TypeError": false,
    "Uint16Array": false,
    "Uint32Array": false,
    "Uint8Array": false,
    "Uint8ClampedArray": false,
    "undefined": false,
    "unescape": false,
    "URIError": false,
    "valueOf": false,
    "WeakMap": false,
    "WeakSet": false,
    "arguments": false,
    "GLOBAL": false,
    "root": false,
    "__dirname": false,
    "__filename": false,
    "Buffer": false,
    "clearImmediate": false,
    "clearInterval": false,
    "clearTimeout": false,
    "console": false,
    "exports": true,
    "global": false,
    "Intl": false,
    "module": false,
    "process": false,
    "require": false,
    "setImmediate": false,
    "setInterval": false,
    "setTimeout": false,
    "URL": false,
    "URLSearchParams": false,
    "after": false,
    "afterEach": false,
    "before": false,
    "beforeEach": false,
    "context": false,
    "describe": false,
    "it": false,
    "mocha": false,
    "run": false,
    "setup": false,
    "specify": false,
    "suite": false,
    "suiteSetup": false,
    "suiteTeardown": false,
    "teardown": false,
    "test": false,
    "xcontext": false,
    "xdescribe": false,
    "xit": false,
    "xspecify": false,
    "document": false,
    "navigator": false,
    "window": false
  },
  "env": {
    "es6": true,
    "node": true,
    "mocha": true
  },
  "rules": {
    "accessor-pairs": "error",
    "arrow-spacing": [
      "error",
      {
        "before": true,
        "after": true
      }
    ],
    "block-spacing": [
      "error",
      "always"
    ],
    "brace-style": [
      "error",
      "1tbs",
      {
        "allowSingleLine": true
      }
    ],
    "camelcase": [
      "error",
      {
        "properties": "never"
      }
    ],
    "comma-dangle": [
      "error",
      "only-multiline"
    ],
    "comma-spacing": [
      "error",
      {
        "before": false,
        "after": true
      }
    ],
    "comma-style": [
      "error",
      "last"
    ],
    "constructor-super": "error",
    "curly": [
      "error",
      "multi-line"
    ],
    "dot-location": [
      "error",
      "property"
    ],
    "eol-last": "error",
    "eqeqeq": [
      "error",
      "always",
      {
        "null": "ignore"
      }
    ],
    "func-call-spacing": [
      "error",
      "never"
    ],
    "generator-star-spacing": [
      "error",
      {
        "before": true,
        "after": true
      }
    ],
    "handle-callback-err": [
      "error",
      "^(err|error)$"
    ],
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1,
        "VariableDeclarator": 1,
        "outerIIFEBody": 1,
        "MemberExpression": 1,
        "FunctionDeclaration": {
          "parameters": 1,
          "body": 1
        },
        "FunctionExpression": {
          "parameters": 1,
          "body": 1
        },
        "CallExpression": {
          "arguments": 1
        },
        "ArrayExpression": 1,
        "ObjectExpression": 1,
        "ImportDeclaration": 1,
        "flatTernaryExpressions": false,
        "ignoreComments": false
      }
    ],
    "key-spacing": [
      "error",
      {
        "beforeColon": false,
        "afterColon": true
      }
    ],
    "keyword-spacing": [
      "error",
      {
        "before": true,
        "after": true
      }
    ],
    "new-cap": [
      "error",
      {
        "newIsCap": true,
        "capIsNew": false
      }
    ],
    "new-parens": "error",
    "no-array-constructor": "error",
    "no-caller": "error",
    "no-class-assign": "error",
    "no-compare-neg-zero": "error",
    "no-cond-assign": "error",
    "no-const-assign": "error",
    "no-constant-condition": [
      "error",
      {
        "checkLoops": false
      }
    ],
    "no-control-regex": "error",
    "no-debugger": "error",
    "no-delete-var": "error",
    "no-dupe-args": "error",
    "no-dupe-class-members": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-empty-character-class": "error",
    "no-empty-pattern": "error",
    "no-eval": "error",
    "no-ex-assign": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-extra-boolean-cast": "error",
    "no-extra-parens": [
      "error",
      "functions"
    ],
    "no-fallthrough": "error",
    "no-floating-decimal": "error",
    "no-func-assign": "error",
    "no-global-assign": "error",
    "no-implied-eval": "error",
    "no-inner-declarations": [
      "error",
      "functions"
    ],
    "no-invalid-regexp": "error",
    "no-irregular-whitespace": "error",
    "no-iterator": "error",
    "no-label-var": "error",
    "no-labels": [
      "error",
      {
        "allowLoop": false,
        "allowSwitch": false
      }
    ],
    "no-lone-blocks": "error",
    "no-mixed-operators": [
      "error",
      {
        "groups": [
          [
            "==",
            "!=",
            "===",
            "!==",
            ">",
            ">=",
            "<",
            "<="
          ],
          [
            "&&",
            "||"
          ],
          [
            "in",
            "instanceof"
          ]
        ],
        "allowSamePrecedence": true
      }
    ],
    "no-mixed-spaces-and-tabs": "error",
    "no-multi-spaces": "error",
    "no-multi-str": "error",
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 1,
        "maxEOF": 0
      }
    ],
    "no-negated-in-lhs": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-object": "error",
    "no-new-require": "error",
    "no-new-symbol": "error",
    "no-new-wrappers": "error",
    "no-obj-calls": "error",
    "no-octal": "error",
    "no-octal-escape": "error",
    "no-path-concat": "error",
    "no-proto": "error",
    "no-redeclare": "error",
    "no-regex-spaces": "error",
    "no-return-assign": [
      "error",
      "except-parens"
    ],
    "no-return-await": "error",
    "no-self-assign": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-shadow-restricted-names": "error",
    "no-sparse-arrays": "error",
    "no-tabs": "error",
    "no-template-curly-in-string": "error",
    "no-this-before-super": "error",
    "no-throw-literal": "error",
    "no-trailing-spaces": "error",
    "no-undef": "error",
    "no-undef-init": "error",
    "no-unexpected-multiline": "error",
    "no-unmodified-loop-condition": "error",
    "no-unneeded-ternary": [
      "error",
      {
        "defaultAssignment": false
      }
    ],
    "no-unreachable": "error",
    "no-unsafe-finally": "error",
    "no-unsafe-negation": "error",
    "no-unused-expressions": [
      0,
      {
        "allowShortCircuit": true,
        "allowTernary": true,
        "allowTaggedTemplates": true
      }
    ],
    "no-unused-vars": [
      "error",
      {
        "vars": "all",
        "args": "none",
        "ignoreRestSiblings": true
      }
    ],
    "no-use-before-define": [
      "error",
      {
        "functions": false,
        "classes": false,
        "variables": false
      }
    ],
    "no-useless-call": "error",
    "no-useless-computed-key": "error",
    "no-useless-constructor": "error",
    "no-useless-escape": "error",
    "no-useless-rename": "error",
    "no-useless-return": "error",
    "no-whitespace-before-property": "error",
    "no-with": "error",
    "object-property-newline": [
      "error",
      {
        "allowMultiplePropertiesPerLine": true
      }
    ],
    "one-var": [
      "error",
      {
        "initialized": "never"
      }
    ],
    "operator-linebreak": [
      "error",
      "after",
      {
        "overrides": {
          "?": "before",
          ":": "before"
        }
      }
    ],
    "padded-blocks": [
      "error",
      {
        "blocks": "never",
        "switches": "never",
        "classes": "never"
      }
    ],
    "prefer-promise-reject-errors": "error",
    "quotes": [
      "error",
      "single",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": true
      }
    ],
    "rest-spread-spacing": [
      "error",
      "never"
    ],
    "semi": [
      "error",
      "never"
    ],
    "semi-spacing": [
      "error",
      {
        "before": false,
        "after": true
      }
    ],
    "space-before-blocks": [
      "error",
      "always"
    ],
    "space-before-function-paren": [
      "error",
      "always"
    ],
    "space-in-parens": [
      "error",
      "never"
    ],
    "space-infix-ops": "error",
    "space-unary-ops": [
      "error",
      {
        "words": true,
        "nonwords": false
      }
    ],
    "spaced-comment": [
      "error",
      "always",
      {
        "line": {
          "markers": [
            "*package",
            "!",
            "/",
            ",",
            "="
          ]
        },
        "block": {
          "balanced": true,
          "markers": [
            "*package",
            "!",
            ",",
            ":",
            "::",
            "flow-include"
          ],
          "exceptions": [
            "*"
          ]
        }
      }
    ],
    "symbol-description": "error",
    "template-curly-spacing": [
      "error",
      "never"
    ],
    "template-tag-spacing": [
      "error",
      "never"
    ],
    "unicode-bom": [
      "error",
      "never"
    ],
    "use-isnan": "error",
    "valid-typeof": [
      "error",
      {
        "requireStringLiterals": true
      }
    ],
    "wrap-iife": [
      "error",
      "any",
      {
        "functionPrototypeMethods": true
      }
    ],
    "yield-star-spacing": [
      "error",
      "both"
    ],
    "yoda": [
      "error",
      "never"
    ],
    "import/export": "error",
    "import/first": "error",
    "import/no-duplicates": "error",
    "import/no-webpack-loader-syntax": "error",
    "node/no-deprecated-api": "error",
    "node/process-exit-as-throw": "error",
    "promise/param-names": "error",
    "standard/array-bracket-even-spacing": [
      "error",
      "either"
    ],
    "standard/computed-property-even-spacing": [
      "error",
      "even"
    ],
    "standard/no-callback-literal": "error",
    "standard/object-curly-even-spacing": [
      "error",
      "either"
    ],
    "jsx-quotes": [
      "error",
      "prefer-single"
    ],
    "react/jsx-boolean-value": "error",
    "react/jsx-curly-spacing": [
      "error",
      "never"
    ],
    "react/jsx-equals-spacing": [
      "warn",
      "never"
    ],
    "react/jsx-indent": [
      "error",
      2
    ],
    "react/jsx-indent-props": [
      "error",
      2
    ],
    "react/jsx-no-duplicate-props": [
      "warn",
      {
        "ignoreCase": true
      }
    ],
    "react/jsx-no-undef": "warn",
    "react/jsx-tag-spacing": [
      "error",
      {
        "beforeSelfClosing": "always"
      }
    ],
    "react/jsx-uses-react": "warn",
    "react/jsx-uses-vars": "warn",
    "react/self-closing-comp": "error",
    "react/jsx-no-bind": [
      "error",
      {
        "allowArrowFunctions": true,
        "allowBind": false,
        "ignoreRefs": true
      }
    ],
    "react/no-did-update-set-state": "error",
    "react/no-unknown-property": "error",
    "react/no-unused-prop-types": 1,
    "react/prop-types": "error",
    "react/react-in-jsx-scope": "warn",
    "chai-friendly/no-unused-expressions": [
      "error",
      {
        "allowShortCircuit": true,
        "allowTernary": true
      }
    ],
    "no-console": "warn",
    "no-nested-ternary": "warn",
    "react/default-props-match-prop-types": "warn",
    "react/jsx-pascal-case": [
      "warn",
      {
        "allowAllCaps": true,
        "ignore": []
      }
    ],
    "react/no-deprecated": "warn",
    "react/no-direct-mutation-state": "error",
    "react/no-is-mounted": "warn",
    "react/no-multi-comp": [
      "warn",
      {
        "ignoreStateless": true
      }
    ],
    "react/require-render-return": "warn",
    "strict": 0
  },
  "parserOptions": {
    "ecmaVersion": 8,
    "ecmaFeatures": {
      "globalReturn": true,
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "import",
    "node",
    "promise",
    "standard",
    "react",
    "chai-friendly"
  ],
  "extends": [
    "/Users/david.almeida/Projects/sui/packages/sui-lint/node_modules/eslint-config-standard-jsx/index.js",
    "standard",
    "standard-react",
    "./node_modules/@s-ui/lint/eslintrc.js"
  ],
  "parser": "/Users/david.almeida/Projects/sui/packages/sui-lint/node_modules/babel-eslint/lib/index.js"
}
```


This output was obtained executing:

```sh
$ npm run eslint:print-rules
```
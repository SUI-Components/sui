# Eslint detailed rules

## Rules used by eslint

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
      "off",
      {
        "before": true,
        "after": true
      }
    ],
    "block-spacing": [
      "off",
      "always"
    ],
    "brace-style": [
      "off",
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
      "off",
      {
        "arrays": "never",
        "objects": "never",
        "imports": "never",
        "exports": "never",
        "functions": "never"
      }
    ],
    "comma-spacing": [
      "off",
      {
        "before": false,
        "after": true
      }
    ],
    "comma-style": [
      "off",
      "last"
    ],
    "constructor-super": "error",
    "curly": [
      0,
      "multi-line"
    ],
    "dot-location": [
      "off",
      "property"
    ],
    "eol-last": "off",
    "eqeqeq": [
      "error",
      "always",
      {
        "null": "ignore"
      }
    ],
    "func-call-spacing": [
      "off",
      "never"
    ],
    "generator-star-spacing": [
      "off",
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
      "off",
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
      "off",
      {
        "beforeColon": false,
        "afterColon": true
      }
    ],
    "keyword-spacing": [
      "off",
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
    "new-parens": "off",
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
      "off",
      "functions"
    ],
    "no-fallthrough": "error",
    "no-floating-decimal": "off",
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
      0,
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
    "no-mixed-spaces-and-tabs": "off",
    "no-multi-spaces": "off",
    "no-multi-str": "error",
    "no-multiple-empty-lines": [
      "off",
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
    "no-tabs": 0,
    "no-template-curly-in-string": "error",
    "no-this-before-super": "error",
    "no-throw-literal": "error",
    "no-trailing-spaces": "off",
    "no-undef": "error",
    "no-undef-init": "error",
    "no-unexpected-multiline": 0,
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
    "no-whitespace-before-property": "off",
    "no-with": "error",
    "object-property-newline": [
      "off",
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
      "off",
      "after",
      {
        "overrides": {
          "?": "before",
          ":": "before"
        }
      }
    ],
    "padded-blocks": [
      "off",
      {
        "blocks": "never",
        "switches": "never",
        "classes": "never"
      }
    ],
    "prefer-promise-reject-errors": "error",
    "quotes": [
      0,
      "single",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": true
      }
    ],
    "rest-spread-spacing": [
      "off",
      "never"
    ],
    "semi": [
      "off",
      "never"
    ],
    "semi-spacing": [
      "off",
      {
        "before": false,
        "after": true
      }
    ],
    "space-before-blocks": [
      "off",
      "always"
    ],
    "space-before-function-paren": [
      "off",
      "always"
    ],
    "space-in-parens": [
      "off",
      "never"
    ],
    "space-infix-ops": "off",
    "space-unary-ops": [
      "off",
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
      "off",
      "never"
    ],
    "template-tag-spacing": [
      "off",
      "never"
    ],
    "unicode-bom": [
      "off",
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
      "off",
      "any",
      {
        "functionPrototypeMethods": true
      }
    ],
    "yield-star-spacing": [
      "off",
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
      "off",
      "either"
    ],
    "standard/computed-property-even-spacing": [
      "off",
      "even"
    ],
    "standard/no-callback-literal": "error",
    "standard/object-curly-even-spacing": [
      "off",
      "either"
    ],
    "jsx-quotes": [
      "off",
      "prefer-single"
    ],
    "react/jsx-boolean-value": "error",
    "react/jsx-curly-spacing": [
      "off",
      "never"
    ],
    "react/jsx-equals-spacing": [
      "off",
      "never"
    ],
    "react/jsx-indent": [
      "off",
      2
    ],
    "react/jsx-indent-props": [
      "off",
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
      "off",
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
    "strict": 0,
    "lines-around-comment": 0,
    "max-len": 0,
    "no-confusing-arrow": 0,
    "array-bracket-newline": "off",
    "array-bracket-spacing": "off",
    "array-element-newline": "off",
    "arrow-parens": "off",
    "computed-property-spacing": "off",
    "function-paren-newline": "off",
    "generator-star": "off",
    "implicit-arrow-linebreak": "off",
    "indent-legacy": "off",
    "multiline-ternary": "off",
    "newline-per-chained-call": "off",
    "no-arrow-condition": "off",
    "no-comma-dangle": "off",
    "no-extra-semi": "off",
    "no-reserved-keys": "off",
    "no-space-before-semi": "off",
    "no-spaced-func": "off",
    "no-wrap-func": "off",
    "nonblock-statement-body-position": "off",
    "object-curly-newline": "off",
    "object-curly-spacing": "off",
    "one-var-declaration-per-line": "off",
    "quote-props": "off",
    "semi-style": "off",
    "space-after-function-name": "off",
    "space-after-keywords": "off",
    "space-before-function-parentheses": "off",
    "space-before-keywords": "off",
    "space-in-brackets": "off",
    "space-return-throw-case": "off",
    "space-unary-word-ops": "off",
    "switch-colon-spacing": "off",
    "wrap-regex": "off",
    "react/jsx-closing-bracket-location": "off",
    "react/jsx-closing-tag-location": "off",
    "react/jsx-first-prop-new-line": "off",
    "react/jsx-max-props-per-line": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-space-before-closing": "off",
    "react/jsx-wrap-multilines": "off",
    "prettier/prettier": [
      "error",
      {
        "printWidth": 80,
        "tabWidth": 2,
        "singleQuote": true,
        "trailingComma": "none",
        "bracketSpacing": false,
        "semi": false,
        "useTabs": false,
        "parser": "babylon",
        "jsxBracketSameLine": false,
        "arrowParens": "avoid"
      }
    ]
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
    "chai-friendly",
    "prettier"
  ],
  "extends": [
    "/Users/david.almeida/Projects/sui/packages/sui-lint/node_modules/eslint-config-standard-jsx/index.js",
    "standard",
    "standard-react",
    "./node_modules/@s-ui/lint/eslintrc.js",
    "prettier",
    "prettier/standard",
    "prettier/react"
  ],
  "parser": "/Users/david.almeida/Projects/sui/packages/sui-lint/node_modules/babel-eslint/lib/index.js"
}
```

---

This output was obtained executing:

```sh
$ npm run eslint:print-rules
```

## Rules conflicting with prettier

No rules that are unnecessary or conflict with Prettier were found.

---

This output was obtained executing:

```sh
$ npm run eslint:prettier-check
```


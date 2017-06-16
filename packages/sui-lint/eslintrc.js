module.exports = {
  "env": {
    "mocha": true
  },
  "extends": ["standard", "standard-react"],
  "parser": "babel-eslint",
  "rules": {
    "no-console": "warn",
    "no-debugger": "error",
    "no-nested-ternary": "warn",
    "react/jsx-equals-spacing": ["warn", "never"],
    "react/jsx-no-duplicate-props": ["warn", { "ignoreCase": true }],
    "react/jsx-no-undef": "warn",
    "react/jsx-pascal-case": ["warn", {
      "allowAllCaps": true,
      "ignore": []
    }],
    "react/jsx-uses-react": "warn",
    "react/jsx-uses-vars": "warn",
    "react/no-deprecated": "warn",
    "react/no-direct-mutation-state": "warn",
    "react/no-is-mounted": "warn",
    "react/no-multi-comp": ["warn", { "ignoreStateless": true }],
    "react/react-in-jsx-scope": "warn",
    "react/require-render-return": "warn",
    "strict": 0
  }
}


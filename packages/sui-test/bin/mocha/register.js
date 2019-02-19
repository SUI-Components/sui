require('@babel/register')({
  only: [/test/, /src/, /@s-ui/],
  presets: ['babel-preset-sui'],
  plugins: [
    'babel-plugin-dynamic-import-node',
    '@babel/plugin-transform-modules-commonjs'
  ]
})

require('@babel/register')({
  only: [/test/, /src/, /@s-ui/, /@babel\/runtime/],
  presets: ['babel-preset-sui'],
  plugins: [
    'babel-plugin-dynamic-import-node',
    '@babel/plugin-transform-modules-commonjs'
  ]
})

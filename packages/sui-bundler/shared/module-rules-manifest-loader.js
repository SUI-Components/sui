module.exports = manifestURL => ({
  test: /(\.js)$/,
  use: [
    {
      loader: 'externals-manifest-loader',
      options: {
        manifestURL
      }
    }
  ]
})

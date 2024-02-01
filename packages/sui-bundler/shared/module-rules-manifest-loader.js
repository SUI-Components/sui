export default manifestURL => ({
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

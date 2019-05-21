export default manifestURL => ({
  test: /(\.css|\.scss|\.js)$/,
  use: [
    {
      loader: 'externals-manifest-loader',
      options: {
        manifestURL
      }
    }
  ]
})

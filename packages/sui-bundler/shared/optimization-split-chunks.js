const {config} = require('./')

const hasToSplitFrameworksOnChunk =
  config.optimizations && config.optimizations.splitFrameworkOnChunk

const frameworkSplitChunk = {
  framework: {
    chunks: 'all',
    name: 'framework',
    // This regex ignores nested copies of framework libraries so they're
    // bundled with their issuer: https://github.com/vercel/next.js/pull/9012
    test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
    priority: 40,
    // Don't let webpack eliminate this chunk (prevents this chunk from
    // becoming a part of the commons chunk)
    enforce: true
  }
}

exports.splitChunks = {
  cacheGroups: {
    ...(hasToSplitFrameworksOnChunk && frameworkSplitChunk),
    vendor: {
      chunks: 'all',
      name: 'vendor',
      test: 'vendor',
      enforce: true,
      reuseExistingChunk: true
    }
  }
}

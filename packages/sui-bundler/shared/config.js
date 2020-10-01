const {config} = require('./')

const {extractComments, sourcemaps} = config

exports.extractComments = extractComments || true
exports.sourceMap = sourcemaps && sourcemaps.prod ? sourcemaps.prod : 'none'

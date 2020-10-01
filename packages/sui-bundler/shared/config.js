const {config} = require('./')

const {extractComments, sourcemaps} = config

exports.extractComments = extractComments || false
exports.sourceMap = sourcemaps && sourcemaps.prod ? sourcemaps.prod : 'none'

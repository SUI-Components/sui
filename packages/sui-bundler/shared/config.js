const {config} = require('./')

const {sourcemaps} = config

exports.sourceMap = sourcemaps && sourcemaps.prod ? sourcemaps.prod : 'none'

require('babel-core/register')({presets: ['sui']})
const getPerf = require('../src/').default
const example1 = require('./example-1').default
const example2 = require('./example-2').default
const example3 = require('./example-3').default

example1(getPerf('example1'))
example2(getPerf('example2'))
example3(getPerf('example3'))

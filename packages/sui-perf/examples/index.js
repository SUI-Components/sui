require('babel-core/register')({presets: ['sui']})
var getPerf = require('../src/').default
var example1 = require('./example-1').default
var example2 = require('./example-2').default
var example3 = require('./example-3').default

example1(getPerf('example1'))
example2(getPerf('example2'))
example3(getPerf('example3'))

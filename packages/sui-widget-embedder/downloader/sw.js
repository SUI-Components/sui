/* eslint-disable */
/* global WorkboxSW importScripts */
var cdn = require('static-cdn')()

importScripts(cdn + '/workbox-sw.prod.v2.1.2')

var workboxSW = new WorkboxSW({clientsClaim: true})
workboxSW.precache(require('static-cache')())

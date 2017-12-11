;(function () {
  'use strict'
  var manifests = require('static-manifests')()
  var pathnamesRegExp = require('static-pathnamesRegExp')()
  var cdn = require('static-cdn')()
  // https://davidwalsh.name/javascript-loader
  var load = (function () {
    function loaderFor (tag) {
      return function (url) {
        return new Promise(function (resolve, reject) {
          var element = document.createElement(tag)
          var parent = 'body'
          var attr = 'src'

          element.onload = function () {
            resolve(url)
          }
          element.onerror = function () {
            reject(url)
          }

          switch (tag) {
            case 'script':
              element.async = true
              break
            case 'link':
              element.type = 'text/css'
              element.rel = 'stylesheet'
              attr = 'href'
              parent = 'head'
          }

          element[attr] = url
          document[parent].appendChild(element)
        })
      }
    }
    return {
      css: loaderFor('link'),
      js: loaderFor('script')
    }
  })()

  // https://github.com/CacheControl/promise-series/blob/master/index.js
  function promiseInSerie (array, haltCallback) {
    if (!(haltCallback instanceof Function)) {
      haltCallback = function () {
        return true
      }
    }
    return new Promise(function (resolve, reject) {
      var i = 0
      var len = array.length
      var results = []

      function processPromise (result) {
        results[i] = result
        if (!haltCallback(result)) {
          return resolve(results)
        }
        i++
        next()
      }

      function next () {
        if (i >= len) return resolve(results)

        var method = array[i]
        if (typeof method !== 'function') {
          return processPromise(method)
        }

        var p = method()
        if (typeof p.then === 'function' && typeof p.catch === 'function') {
          p.then(processPromise).catch(reject)
        } else {
          processPromise(p)
        }
      }

      next()
    })
  }

  function loadAssetsFor (page) {
    var baseUrl = cdn + '/' + page + '/'
    var manifest = manifests[page]
    var loadStyle = function () {
      var css = manifest['app.css'] || manifest['main.css']
      return css ? load.css(baseUrl + css) : Promise.resolve()
    }
    var loadScripts = [
      manifest['runtime.js'],
      manifest['main.js'],
      manifest['vendor.js'],
      manifest['app.js']
    ]
      .filter(Boolean)
      .map(function (script) {
        return function () {
          return load.js(baseUrl + script)
        }
      })

    return promiseInSerie([loadStyle].concat(loadScripts)).then(function () {
      console.log('All widgets for ' + page + ' loads') // eslint-disable-line
    })
  }

  var pages = []
  for (var key in pathnamesRegExp) {
    if (window.location.pathname.match(new RegExp(pathnamesRegExp[key]))) {
      pages.push(key)
    }
  }
  pages.length !== 0 &&
    // !window.location.host.match(/localhost/) &&
    promiseInSerie(
      pages.map(function (page) {
        return function () {
          return loadAssetsFor(page)
        }
      })
    )
})()

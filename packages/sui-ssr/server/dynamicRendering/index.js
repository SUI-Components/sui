import path from 'path'
import fs from 'fs'
import seoBotDetect from './seoBotDetect'
import replace from 'stream-replace'

const INDEX_HTML_PATH = path.join(process.cwd(), 'public', 'index.html')
const HEAD_OPENING_TAG = '<head>'
const HEAD_CLOSING_TAG = '</head>'

export default function dynamicRendering(fallback, dynamicsURLS = []) {
  return function middleware(req, resp, next) {
    const criticalCSS = req.criticalCSS

    if (!dynamicsURLS.length || seoBotDetect(req)) {
      return fallback.call(this, req, resp, next)
    }

    const enabledDynamicRendering = dynamicsURLS.some(url =>
      req.url.match(new RegExp(url))
    )

    enabledDynamicRendering && resp.type('html')

    let indexHTMLStream
    if (criticalCSS) {
      indexHTMLStream = fs
        .createReadStream(INDEX_HTML_PATH)
        .pipe(
          replace(
            HEAD_OPENING_TAG,
            `${HEAD_OPENING_TAG}<style>${criticalCSS}</style>`
          )
        )
        .pipe(
          replace(
            'rel="stylesheet"',
            'rel="stylesheet" media="only x" as="style" onload="this.media=\'all\'"'
          )
        )
        .pipe(
          replace(
            HEAD_CLOSING_TAG,
            `
        <script>
        /*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
!function(t){"use strict";t.loadCSS||(t.loadCSS=function(){});var e=loadCSS.relpreload={};if(e.support=function(){var e;try{e=t.document.createElement("link").relList.supports("preload")}catch(t){e=!1}return function(){return e}}(),e.bindMediaToggle=function(t){var e=t.media||"all";function a(){t.addEventListener?t.removeEventListener("load",a):t.attachEvent&&t.detachEvent("onload",a),t.setAttribute("onload",null),t.media=e}t.addEventListener?t.addEventListener("load",a):t.attachEvent&&t.attachEvent("onload",a),setTimeout(function(){t.rel="stylesheet",t.media="only x"}),setTimeout(a,3e3)},e.poly=function(){if(!e.support())for(var a=t.document.getElementsByTagName("link"),n=0;n<a.length;n++){var o=a[n];"preload"!==o.rel||"style"!==o.getAttribute("as")||o.getAttribute("data-loadcss")||(o.setAttribute("data-loadcss",!0),e.bindMediaToggle(o))}},!e.support()){e.poly();var a=t.setInterval(e.poly,500);t.addEventListener?t.addEventListener("load",function(){e.poly(),t.clearInterval(a)}):t.attachEvent&&t.attachEvent("onload",function(){e.poly(),t.clearInterval(a)})}"undefined"!=typeof exports?exports.loadCSS=loadCSS:t.loadCSS=loadCSS}("undefined"!=typeof global?global:this);
        </script>${HEAD_CLOSING_TAG}
        `
          )
        )
    } else {
      indexHTMLStream = fs.createReadStream(INDEX_HTML_PATH)
    }

    return enabledDynamicRendering
      ? indexHTMLStream.pipe(resp)
      : fallback.call(this, req, resp, next)
  }
}

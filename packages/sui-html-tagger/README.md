# @s-ui/html-tagger
Tool to tagger the HTML of your webpage from a service.

# Use:

* Load the script with the tagger `tagger.umd.min.js`. That script expose the global object `window.SCM.Tagger`
* Load After the first script other script with the tag´s object. And call to `window.SCM.Tagger()` [example](https://github.com/scm-spain/html-tagger/blob/master/docs/tags.js)

# Performance:

* It uses requestIdleCallback if supported, in order to only tag when the browser is idle. If not available, it tries to use requestAnimationFrame in order to tag elements smoothly.
* It uses MutationObserver if supported in order to only tag elements when these are added.

### Debugger:

You can use this command in the console to check the tagging:

```js
console.table(
  Array.from(document.querySelectorAll('[data-tealium-tag]'))
)
```

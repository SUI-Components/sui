# @s-ui/html-tagger
> Tool to tag the HTML of your webpage from a service.

It provides:
* A way to tag HTML elements, perfect for add tracking on SPAs.
* Performance focused in order to avoid jank and heavy script load.

# Use:

```js
import { tagHTML } from '@s-ui/html-tagger'
// create an object like this
const tags = {
  'CSS_SELECTOR_OF_THE_ELEMENT_TO_TAG': {
    'DATA_TAG_NAME_TO_ADD': 'DATA_TAG_VALUE_TO_ADD'
  },
  '.simple-div': {
    'tracking-tag': 'c_tracking_tag'
  },
  '.button': {
    'tracking-tag': 'c_tracking_button'
  },
  '.added-later': {
    'tracking-tag': 'c_tracking_dynamic'
  }
}

// execute the method and use the created tags
tagHTML({ tags })
```

# Performance:

* It uses requestIdleCallback if supported, in order to only tag when the browser is idle. If not available, it tries to use requestAnimationFrame in order to tag elements smoothly.
* It uses MutationObserver if supported in order to only tag elements when these are added.

### Debugger:

You can use this command in the console to check if the tagging has worked correctly.

```js
console.table(
  Array.from(document.querySelectorAll('[data-tracking-tag]'))
)
```

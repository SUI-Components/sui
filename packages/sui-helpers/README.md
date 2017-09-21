# sui-helpers

> A set of internal helpers used by sui-related packages.


## Usage

```js
import {serialSpawn} from '@s-ui/helpers/cli'

serialSpawn([
    ['sui-lint', ['js']],
    ['sui-lint', ['sass']],
    ['npm', ['run', 'test']]
])
  .then(code => process.exit(code))
  .catch(code => process.exit(code))
```

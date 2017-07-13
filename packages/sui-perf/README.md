# sui-perf
> Scoped javaScript timer based on `performance.mark()` and `performance.measure()`

## Motivation

**sui-perf** is based on [marky](https://www.npmjs.com/package/marky), but adds key features oriented
to performance debugging on server side:
* Scoped instances of `performance`, so several request can be tracked separately (despite they're simultaneous).
* Text-based timeline chart generation, so you can check performances as in dev tools.

![example]

## Usage

Mark your measurements and print them as a timeline.

```js
perf.mark('Example 2')
perf.measure('Example 2 - task(70)')(() => task(70))
perf.measure('Example 2 - asyncTask(200)')(() => asyncTask(200))
  .then(x => perf.stop('Example 2'))
  .then(x => perf.getEntries())
  .then(printTimelineChart())
```
Output:

![example-2]

Charts can get as complex as needed to find out the blockers of your code. Check out examples running `npm run examples`:

![example-3]


## Installation

```sh
npm install @schibstedspain/sui-perf --save
```

## API Reference


### Measurements

#### getPerf(scopeUniqueId)

Get an instance of `perf` which measurements are scoped to this instance.

```js
import getPerf from '@schibstedspain/sui-perf'

const perf = getPerf(req.reqId)
perf.mark('Request')
/* ... */
perf.stop('Request')
```


#### perf.mark(name)
Mark the beginning of a measurement.


#### perf.stop(name)
Mark the ending of a measurement. This creates a new a new entry with given name.

#### perf.getEntries()
Get entries of given instances. The entries follow structure of browser's [PerformanceEntry](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry) instances.

```js
perf.mark('task1'); /* ... */ perf.stop('task1')
perf.mark('task2'); /* ... */ perf.stop('task2')
console.log(perf.getEntries())

/*
[ { startTime: 134.809812, name: 'task1', duration: 564.807043, entryType: 'measure' },
  { startTime: 135.348685, name: 'task2', duration: 490.119122, entryType: 'measure' } ]
 */
```

#### perf.measure(label)(func)
Measure the execution of given function and return what the function returns.

**In case a instance of `Promise` is returned, the measurement will measure the actual promise.**

Original:
```js
fetch('api.domain.com/user/58')
  .then(response => response.json())
  .then(console.log)
```

Measuring fetch:
```js
perf.measure('Fetch user')
  (() => fetch('api.domain.com/user/58') )
  .then(response => response.json())
  .then(console.log)
```

### Charts

`@schibstedspain/sui-perf/lib/charts` has no dependency of and can be imported separately.



#### getTimelineChart(timelineOptions)(entries)
Get a text-based timeline chart from given entries

```js
import {getTimelineChart} from '@schibstedspain/sui-perf/lib/charts'

const timeline = getTimelineChart(perf.getEntries())
console.log(timeline)
/*
timeline        start  time   %    label
███████████████ 0ms    138ms  100% Example 2
████            0ms    33ms   24%  Example 2 - task(70)
    ███████████ 33ms   105ms  76%  Example 2 - asyncTask(200)
 */
```

#### printTimelineChart(timelineOptions)(entries)

A shorthand to directly print the chart with `console.log`.

```js
import {printTimelineChart} from '@schibstedspain/sui-perf/lib/charts'
printTimelineChart(perf.getEntries())
/*
timeline        start  time   %    label
███████████████ 0ms    138ms  100% Example 2
████            0ms    33ms   24%  Example 2 - task(70)
    ███████████ 33ms   105ms  76%  Example 2 - asyncTask(200)
 */
```


### Special measurements

#### measureSuperagent(superagent, perf)
Measure all requests made with the given instance of [superagent](https://www.npmjs.com/package/superagent).

```js
import superagent from 'superagent'
import getPerf from '@schibstedspain/sui-perf'
import measureSuperagent from '@schibstedspain/sui-perf/lib/measure-superagent'

const perf = getPerf(req.reqId)
const clearMeasureSuperAgent =  measureSuperagent(superagent, perf)

/* ... */
console.log(perf.getEntries())
clearMeasureSuperAgent()
```


## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).


[example]: ./.assets/example.png
[example-2]: ./.assets/example-2.png
[example-3]: ./.assets/example-3.png

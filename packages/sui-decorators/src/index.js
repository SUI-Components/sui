import cache from './decorators/cache'
import streamify from './decorators/streamify'
import inlineError from './decorators/error'
import tracer from './decorators/tracer'
import {DataDogReporter} from './decorators/tracer/reporter/DataDogReporter'

const reporters = {
  DataDogReporter
}

export {cache, streamify, inlineError, tracer, reporters}

// test/types.d.ts
import 'mocha'

import * as sinon from 'sinon'

declare module 'mocha' {
  interface Context {
    requestStub: sinon.SinonStub
    logStub: sinon.SinonStub
    clockStub: sinon.SinonFakeTimers
  }
}

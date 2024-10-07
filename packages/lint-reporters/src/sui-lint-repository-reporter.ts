import type {Results} from '@s-ui/lint/src/RepositoryLinter/Results'

import {Reporter} from './Reporter.js'

export class RepositoryReporter extends Reporter {
  private data: ReturnType<typeof Results['monitorings']>

  static create(): RepositoryReporter {
    return new RepositoryReporter()
  }

  map(results: typeof Results): RepositoryReporter {
    this.data = results.monitorings
    return this
  }

  async send(): Promise<void> {
    if (this.data === undefined) {
      throw new Error('[sui-lint] No data to send. Maybe you must call to map before')
    }

    if (!(await this._isMaster())) {
      return console.log('[sui-lint] Reporters only will happen in MASTER branch.')
    }

    const signals = this.data.map((signal: {rule: string; value: string | number | boolean}) => {
      return {...signal, type: 'repository'}
    })

    await this.sender.send(signals)
  }
}

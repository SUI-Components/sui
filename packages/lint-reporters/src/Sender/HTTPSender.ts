/* eslint @typescript-eslint/no-non-null-assertion:0 */
/* eslint @typescript-eslint/strict-boolean-expressions:0 */

import https from 'node:https'
import {match} from 'ts-pattern'

import type {Sender, Signal} from './Sender'

const ONE_SECOND = 1000
const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const {MS_URL = 'ms-common--metrics.es-global-pro.schip.io', BASIC_AUTH} = process.env

export class HTTPSender implements Sender {
  static create() {
    return new HTTPSender()
  }

  async send(signals: Signal[]): Promise<void> {
    if (!signals || signals.length === 0) return this.log('😡 Sorry but there are not signals to send')

    const body = signals.map(signal =>
      match(signal)
        .with({type: 'repository'}, p => ({rule: p.rule, value: p.value, type: p.type}))
        .with({type: 'js'}, p => ({rule: p.ruleName, value: p.numberOfFails, type: p.type}))
        .exhaustive()
    )

    this.log('🚀 Sending the metric to the microservice.')
    const ok = await this.request(body)

    if (ok) this.log('🤓 The metric has been successfully sent to the microservice.')

    if (!ok) {
      this.log('😅 The initial attempt to send the metric has failed. We will retry in 1 second.')
      await delay(ONE_SECOND)
      match(await this.request(body))
        .with(true, () => this.log('😏 The retry attempt to send the metric has worked successfully.'))
        .with(false, () =>
          this.log(
            '😡 Sorry, but the second retry attempt to send the metric has also failed. We will not attempt again, and the metric will be lost forever.'
          )
        ) // eslint-disable-line
    }

    return undefined
  }

  private log(...msg: string[]): void {
    console.log.apply(console, msg) // eslint-disable-line
  }

  private async request(
    body: Array<{
      rule: string
      value: unknown
      type: Signal['type']
    }>
  ): Promise<boolean> {
    if (BASIC_AUTH === undefined) {
      this.log('❌ BASIC_AUTH env var shouldnt be undefined')
      process.exit(1)
    }

    const bodyReq = {
      metrics: [
        {
          name: 'metrics.frontend.discipline',
          organisationName: process.env.GITHUB_REPOSITORY_OWNER,
          repositoryId: process.env.GITHUB_REPOSITORY_ID,
          tags: body.map(bodyJSON => ({
            tagSetId: match(bodyJSON.type)
              .with('repository', p => 'global.metrics.frontend.repository')
              .with('js', p => 'global.metrics.frontend.code')
              .exhaustive(),
            key: bodyJSON.rule,
            value: bodyJSON.value
          }))
        }
      ]
    }

    return new Promise((resolve, _reject) => {
      const options = {
        hostname: MS_URL,
        port: 443,
        path: '/v2/ci-metrics',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(bodyReq)),
          Authorization: 'Basic ' + BASIC_AUTH
        }
      }

      const req = https.request(options, res => {
        this.log(`STATUS: ${res.statusCode! as unknown as string}`)
        this.log(`HEADERS: ${JSON.stringify(res.headers)}`)
        res.setEncoding('utf8')
        res.on('data', chunk => {
          this.log(`BODY: ${chunk as string}`)
        })
        res.on('end', () => {
          this.log('No more data in response.')
          const isSuccess = res.statusCode && res.statusCode >= 200 && res.statusCode < 300
          resolve(Boolean(isSuccess))
        })
      })

      req.on('error', e => {
        this.log(`problem with request: ${e.message}`)
        resolve(false)
      })

      this.log('Body:\n\n', JSON.stringify(bodyReq, null, 2), '\n\n')

      // Write data to request body
      req.write(JSON.stringify(bodyReq))
      req.end()
    })
  }
}

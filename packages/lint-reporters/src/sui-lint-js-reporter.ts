/* eslint @typescript-eslint/no-misused-promises:0 */
import {Table} from 'console-table-printer'
import type {ESLint} from 'eslint'
import type {Results} from 'globrex'
import globrex from 'globrex'

import type {Config} from '@s-ui/lint/eslintrc'

import type {Signal} from './Sender/Sender.js'
import {Reporter} from './Reporter.js'

const generatePaternFromRule = (rule: string, eslintConfig: Config): Results[] => {
  const globalRules = Object.keys(eslintConfig.rules)
  if (globalRules.some(eslintRule => eslintRule === rule)) return [{regex: /.*/}]

  return eslintConfig.overrides
    .map(override => {
      if (!override.plugins?.some(plugin => plugin === 'sui')) return false

      const rules = Object.keys(override.rules)
      if (!rules.some(overrideRule => overrideRule === rule)) return false

      return override.files.map(glob => globrex(glob))
    })
    .filter(Boolean)
    .flat(Infinity) as unknown as Results[]
}

export class JSReporter extends Reporter {
  private data: {totalFiles: number; paths: string[]; [k: string]: string | number | string[]} | undefined

  static RULES_TO_SEND = ['sui/factory-pattern', 'sui/serialize-deserialize', 'sui/decorators']

  static async create(): Promise<JSReporter> {
    return new JSReporter()
  }

  map(results: Awaited<ReturnType<ESLint['lintFiles']>>): JSReporter {
    const stats = results.reduce<{[k: string]: string[]}>((rulesIDs, entry) => {
      const repitedRulesFailed = entry.messages.map(message => message.ruleId)
      const rulesFailed = new Set([...repitedRulesFailed])

      rulesFailed.forEach(rule => {
        if (rule == null) return

        rulesIDs[rule] = rulesIDs[rule] ?? []
        rulesIDs[rule].push(entry.filePath)
      })
      return rulesIDs
    }, {})

    this.data = {
      totalFiles: results.length,
      paths: results.map(r => r.filePath),
      ...stats
    }

    console.log({ // eslint-disable-line 
      totalFiles: results.length,
      stats: Object.fromEntries(
        Object.entries(stats).map(([rule, files]) => {
          if (!JSReporter.RULES_TO_SEND.some(whiteRule => rule.startsWith(whiteRule))) return []
          return [rule, files.length]
        })
      )
    })

    return this
  }

  async send(): Promise<void> {
    if (this.data === undefined) {
      throw new Error('[sui-lint] No data to send. Maybe you must call to map before')
    }

    if (!(await this._isMaster())) {
      return console.log('[sui-lint] Reporters only will happen in MASTER branch.')
    }

    const repository = await this._getRepository()
    const config: Config = await import(process.cwd() + '/node_modules/@s-ui/lint/eslintrc')

    const {totalFiles, paths, ...rest} = this.data
    console.log(`
      We are apply filter to send ONLY this metrics:

      ${JSReporter.RULES_TO_SEND.join('\n')}

      And your are trying to send all this metrics:

      ${Object.keys(rest).join(`\n`)}
    `)
    const statsEntries = Object.entries(rest)
      .map(entry => {
        const [rule, failedFiles] = entry
        if (!JSReporter.RULES_TO_SEND.some(whiteRule => rule.startsWith(whiteRule))) return false
        const patterns = generatePaternFromRule(rule, config)
        const ruleRelativePaths = paths.filter(path => patterns.some(pattern => path.match(pattern.regex)))?.length

        if (!Array.isArray(failedFiles)) return [rule, 0]

        return [rule, (failedFiles.length * 100) / ruleRelativePaths]
      })
      .filter(Boolean) as Array<[string, number]>

    const stats = Object.fromEntries(statsEntries)
    const signals: Signal[] = Object.entries(stats).map(entry => {
      const [rule, percentageOfFails] = entry
      const signal: Signal = {type: 'js', ruleName: rule, numberOfFails: percentageOfFails, repository}
      return signal
    })
    await this.sender.send(signals)

    if (signals.length === 0) return console.log('[JSReporter#send] Nothing to send. No signals')

    const p = new Table({title: 'List of Signals that will be send to DD'})
    signals.forEach(signal => p.addRow(signal))
    p.printTable()
  }
}

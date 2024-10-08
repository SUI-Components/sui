declare module '@s-ui/lint/src/RepositoryLinter/Results'

declare module '@adv-ui/logger' {
  export type Branch = string
  export interface WebRuleFailedSignal {
    type: 'js'
    ruleName: string
    numberOfFails: number
    repository: string
  }
  export interface WebGoldenPathSignal {
    type: 'repository'
    ruleName: string
    value: number
    repository: string
  }
  export interface Logger {
    webRuleFailed: (signal: WebRuleFailedSignal) => void
    webGoldenPath: (signal: WebGoldenPathSignal) => void
  }

  export const createServerLogger: () => Logger
  export const initTracker: (initOptions: {appName: string; devMode: boolean}) => void
}

declare module '@s-ui/lint/eslintrc' {
  export interface Config {
    rules: Record<string, unknown>
    overrides: Array<{
      plugins: string[]
      files: string[]
      rules: Record<string, string>
    }>
  }
}

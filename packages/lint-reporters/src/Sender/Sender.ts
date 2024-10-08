export type Signal =
  | {type: 'repository'; rule: string; value: string | number | boolean; repository?: string}
  | {type: 'js'; ruleName: string; numberOfFails: number; repository?: string}

export interface Sender {
  send: (signal: Signal[]) => Promise<void>
}

/* global decorator */
export class Whatever {
  @decorator
  async execute() {
    return Promise.resolve('hello')
  }
}

export default function HelloWorld() {
  return <h1>Probando, probando</h1>
}

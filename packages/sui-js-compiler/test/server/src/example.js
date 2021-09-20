/* global decorator */
export class Whatever {
  @decorator
  async execute() {
    return await Promise.resolve('hello')
  }
}

export default function HelloWorld() {
  return <h1>Probando, probando</h1>
}

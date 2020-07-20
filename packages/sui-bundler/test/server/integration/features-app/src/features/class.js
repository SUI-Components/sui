export class Foo {
  staticMethod = 'staticMethod'
  #privateMethod = 'privateMethod'

  get privateGetter() {
    return this.#privateMethod
  }

  set privateSetter(fuzz) {
    this.#privateMethod = fuzz
  }

  constructor(foo) {
    this.#privateMethod = foo
  }
}

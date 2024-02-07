import {faker} from '@faker-js/faker'

const IDENTITY_FN = i => i

let instanceRndID
export class RandomID {
  static create() {
    if (instanceRndID) return instanceRndID
    const seed = process.env.SEED || Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER)
    instanceRndID = new RandomID(seed)

    console.log(`[RandomID.create] Faker created with seed: ${seed}`)
    return instanceRndID
  }

  static restore() {
    instanceRndID = undefined
  }

  constructor(id) {
    this._id = id
  }

  get id() {
    return this._id
  }
}

export class FakeGenerator {
  static create() {
    const seed = RandomID.create().id

    return new FakeGenerator(seed)
  }

  constructor(seed) {
    faker.seed(seed)
    this._faker = faker
  }

  city() {
    return this._faker.location.city()
  }

  email() {
    return this._faker.internet.email()
  }

  uuid() {
    return this._faker.string.uuid()
  }

  words({count, replacer = IDENTITY_FN}) {
    return replacer(this._faker.lorem.words(count))
  }

  color() {
    return this._faker.color.rgb({format: 'hex', casing: 'lower'})
  }

  date({from, to} = {}) {
    return this._faker.date.between({from, to})
  }

  pick(list) {
    return list[Math.floor(Math.random() * list.length)]
  }

  bool() {
    return Math.random() < 0.5
  }

  province() {
    return this._faker.location.county()
  }

  phone() {
    return this._faker.phone.number()
  }

  URL() {
    return this._faker.internet.url()
  }

  imgURL({removeHost} = {removeHost: true}) {
    const url = this._faker.image.imageUrl()

    if (!removeHost) return url

    const uri = new URL(url)
    return uri.pathname.replace('/', '')
  }

  number({min = 0, max = Infinity}) {
    const difference = max - min

    let rand = Math.random()
    rand = Math.floor(rand * difference)
    rand = rand + min

    return rand
  }

  zipCode() {
    return this._faker.location.zipCode()
  }
}

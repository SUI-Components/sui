export default function inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype)
  subClass.prototype.constructor = subClass
  subClass.__proto__ = superClass // eslint-disable-line no-proto
}

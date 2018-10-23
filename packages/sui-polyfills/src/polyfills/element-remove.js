;(function(arr) {
  arr.forEach(function(item) {
    if (item.hasOwnProperty('remove')) {
      return
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        if (this.parentNode !== null) this.parentNode.removeChild(this)
      }
    })
  })
})([
  window.Element.prototype,
  window.CharacterData.prototype,
  window.DocumentType.prototype
])

/* eslint-env mocha */
import {expect} from 'chai'
import {getFocusedItemIndex, getCurrentElementFocused} from '../src/dom/index'

const ID_FIXTURE_ELEMENT = 'fixture-getCurrentElementFocused'
const ID_FIXTURE_LIST = 'fixture-getFocusedItemIndex'

describe('@s-ui/js', () => {
  /* dom:getCurrentElementFocused */
  describe('dom:getCurrentElementFocused', () => {
    beforeEach(() => {
      const fixture = `<div tabindex="0" id='${ID_FIXTURE_ELEMENT}'></div>`
      document.body.insertAdjacentHTML('afterbegin', fixture)
    })
    afterEach(() => {
      const fixture = document.getElementById(ID_FIXTURE_ELEMENT)
      fixture.remove()
    })
    it('should return current focused element', () => {
      const element = document.querySelector(`#${ID_FIXTURE_ELEMENT}`)
      element.focus()
      const currentElementFocused = getCurrentElementFocused()
      expect(currentElementFocused).to.be.equal(element)
    })
  })
  /* dom:getFocusedItemIndex */
  describe('dom:getFocusedItemIndex', () => {
    beforeEach(() => {
      const fixture = `
<ul id='${ID_FIXTURE_LIST}'>
  <li tabindex="0">item 1</li>
  <li tabindex="0">item 2</li>
  <li tabindex="0">item 3</li>
  <li tabindex="0">item 4</li>
  <li tabindex="0">item 5</li>
  <li tabindex="0">item 6</li>
  <li tabindex="0">item 7</li>
  <li tabindex="0">item 8</li>
</ul>
    `
      document.body.insertAdjacentHTML('afterbegin', fixture)
    })
    afterEach(() => {
      const fixture = document.getElementById(ID_FIXTURE_LIST)
      fixture.remove()
    })
    it('should return null if none of the items is selected', () => {
      const items = document.querySelectorAll(`#${ID_FIXTURE_LIST} li`)
      const index = getFocusedItemIndex(items)
      expect(index).to.be.equal(null)
    })

    it('should return 0 if first item of the list is selected', () => {
      const items = document.querySelectorAll(`#${ID_FIXTURE_LIST} li`)
      items[0].focus()
      const index = getFocusedItemIndex(items)
      expect(index).to.be.equal(0)
    })

    it('should return 4 if fifth item of the list is selected', () => {
      const items = document.querySelectorAll(`#${ID_FIXTURE_LIST} li`)
      items[4].focus()
      const index = getFocusedItemIndex(items)
      expect(index).to.be.equal(4)
    })
  })
})

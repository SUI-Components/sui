/* eslint-env mocha */
import {expect} from 'chai'
import {tagHTML} from '../src/index'

describe('Tagger', () => {
  before(() => {
    const tags = {
      '.simple-div': {
        'tracking-tag': 'c_tracking_tag'
      },
      '.button': {
        'tracking-tag': 'c_tracking_button'
      },
      '.added-later': {
        'tracking-tag': 'c_tracking_dynamic'
      }
    }

    const fixture = `
<div id='fixture'>
  <div class='simple-div'>Simple Div Tagging</div>
    <div class='inside-div'>
      Track inside a div
      <em class='element-inside-to-track'>
        Element inside to track
      </em>
    </div>

    <button class='button'>Button</button>
    <button class='button'>Button</button>
  </div>
</div>
  `
    document.body.insertAdjacentHTML('afterbegin', fixture)

    tagHTML({tags})
  })

  it('should tag correctly a div specified in the tags list', done => {
    setTimeout(() => {
      expect(
        document.querySelector('.simple-div').getAttribute('data-tracking-tag')
      ).to.equal('c_tracking_tag')
      done()
    }, 200)
  })

  it('should tag correctly elements specified in the tags list', done => {
    setTimeout(() => {
      expect(
        document.querySelector('.button').getAttribute('data-tracking-tag')
      ).to.equal('c_tracking_button')
      done()
    }, 200)
  })

  it('should tag correctly elements added later in the dom', done => {
    const dynamicHTML = `<div class='added-later'>Dynamic content FTW!</div>`

    document
      .getElementById('fixture')
      .insertAdjacentHTML('afterbegin', dynamicHTML)

    setTimeout(() => {
      expect(
        document.querySelector('.added-later').getAttribute('data-tracking-tag')
      ).to.equal('c_tracking_dynamic')
      done()
    }, 1000)
  })
})

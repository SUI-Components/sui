import {expect} from 'chai'
import sinon from 'sinon'

import {createPageDataMiddleware} from '../../src/middlewares/source/pageData.js'

describe('pageDataMiddleware', () => {
  const fakePayloadFactory = ({event, properties = {}}) => ({
    obj: {
      event,
      properties
    }
  })

  let spy
  let pageData

  beforeEach(() => {
    pageData = createPageDataMiddleware()
    spy = sinon.spy()
  })

  describe('when event ends with "Viewed"', () => {
    it('should store page name and type from properties and pass through the payload unchanged', () => {
      const payload = fakePayloadFactory({
        event: 'Page Viewed',
        properties: {
          page_name: 'home',
          page_type: 'landing'
        }
      })

      pageData({payload, next: spy})

      expect(spy.calledOnce).to.be.true
      expect(spy.firstCall.firstArg).to.deep.equal(payload)
    })

    it('should handle events ending with "Viewed" even without properties', () => {
      const payload = fakePayloadFactory({
        event: 'Product Viewed'
      })

      pageData({payload, next: spy})

      expect(spy.calledOnce).to.be.true
      expect(spy.firstCall.firstArg).to.deep.equal(payload)
    })

    it('should handle events ending with "Viewed" with empty properties', () => {
      const payload = fakePayloadFactory({
        event: 'Category Viewed',
        properties: {}
      })

      pageData({payload, next: spy})

      expect(spy.calledOnce).to.be.true
      expect(spy.firstCall.firstArg).to.deep.equal(payload)
    })
  })

  describe('when event does not end with "Viewed"', () => {
    it('should pass through payload unchanged when no previous "Viewed" event occurred', () => {
      const payload = fakePayloadFactory({
        event: 'Button Clicked',
        properties: {
          button_name: 'submit'
        }
      })

      pageData({payload, next: spy})

      expect(spy.calledOnce).to.be.true
      expect(spy.firstCall.firstArg).to.deep.equal(payload)
    })

    it('should add page_name_origin and page_type when previous "Viewed" event occurred', () => {
      const viewedPayload = fakePayloadFactory({
        event: 'Page Viewed',
        properties: {
          page_name: 'search-results',
          page_type: 'search'
        }
      })

      pageData({payload: viewedPayload, next: spy})

      const clickPayload = fakePayloadFactory({
        event: 'Button Clicked',
        properties: {
          button_name: 'filter'
        }
      })

      pageData({payload: clickPayload, next: spy})

      expect(spy.calledTwice).to.be.true

      const modifiedPayload = spy.secondCall.firstArg
      expect(modifiedPayload.obj.event).to.equal('Button Clicked')
      expect(modifiedPayload.obj.properties).to.deep.equal({
        button_name: 'filter',
        page_name_origin: 'search-results',
        page_type: 'search'
      })
    })

    it('should preserve existing properties when adding page origin data', () => {
      const viewedPayload = fakePayloadFactory({
        event: 'Product Viewed',
        properties: {
          page_name: 'product-detail',
          page_type: 'product',
          product_id: '12345'
        }
      })

      pageData({payload: viewedPayload, next: spy})

      const trackPayload = fakePayloadFactory({
        event: 'Product Added',
        properties: {
          product_id: '12345',
          quantity: 2,
          price: 99.99
        }
      })

      pageData({payload: trackPayload, next: spy})

      const modifiedPayload = spy.secondCall.firstArg
      expect(modifiedPayload.obj.properties).to.deep.equal({
        product_id: '12345',
        quantity: 2,
        price: 99.99,
        page_name_origin: 'product-detail',
        page_type: 'product'
      })
    })

    it('should update page context when a new "Viewed" event occurs', () => {
      const firstViewedPayload = fakePayloadFactory({
        event: 'Page Viewed',
        properties: {
          page_name: 'home',
          page_type: 'landing'
        }
      })

      pageData({payload: firstViewedPayload, next: spy})

      const firstClickPayload = fakePayloadFactory({
        event: 'Button Clicked',
        properties: {
          button_name: 'search'
        }
      })

      pageData({payload: firstClickPayload, next: spy})

      const secondViewedPayload = fakePayloadFactory({
        event: 'Search Results Viewed',
        properties: {
          page_name: 'search-results',
          page_type: 'search'
        }
      })

      pageData({payload: secondViewedPayload, next: spy})

      const secondClickPayload = fakePayloadFactory({
        event: 'Filter Applied',
        properties: {
          filter_type: 'price'
        }
      })

      pageData({payload: secondClickPayload, next: spy})

      expect(spy.callCount).to.equal(4)

      const firstModifiedPayload = spy.secondCall.firstArg
      expect(firstModifiedPayload.obj.properties).to.deep.equal({
        button_name: 'search',
        page_name_origin: 'home',
        page_type: 'landing'
      })

      const secondModifiedPayload = spy.getCall(3).firstArg
      expect(secondModifiedPayload.obj.properties).to.deep.equal({
        filter_type: 'price',
        page_name_origin: 'search-results',
        page_type: 'search'
      })
    })

    it('should handle undefined page_name and page_type gracefully', () => {
      const viewedPayload = fakePayloadFactory({
        event: 'Page Viewed',
        properties: {
          other_property: 'value'
        }
      })

      pageData({payload: viewedPayload, next: spy})

      const clickPayload = fakePayloadFactory({
        event: 'Button Clicked',
        properties: {
          button_name: 'submit'
        }
      })

      pageData({payload: clickPayload, next: spy})

      const modifiedPayload = spy.secondCall.firstArg
      expect(modifiedPayload.obj.properties).to.deep.equal({
        button_name: 'submit',
        page_name_origin: undefined,
        page_type: undefined
      })
    })
  })
})

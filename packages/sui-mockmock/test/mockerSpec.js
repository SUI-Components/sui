import {expect} from 'chai'
import axios from 'axios'
import Mocker from '../src/http'

describe('#ClientMocker', () => {
  describe('when we mock the get method', () => {
    const mocker = new Mocker()
    const fakeUrl = 'https://fake.url'
    const fakePath = '/path'

    beforeEach(() => {
      mocker.create()
    })

    afterEach(() => {
      mocker.restore()
    })

    describe('when mocking without status code', () => {
      beforeEach(() => {
        mocker
          .httpMock(fakeUrl)
          .get(fakePath)
          .reply({})
      })

      it('should resolve statusCode 200', done => {
        axios.get(`${fakeUrl}${fakePath}`).then(({status}) => {
          expect(status).to.be.eq(200)
          done()
        })
      })
    })

    describe('when mocking statusCode 500', () => {
      beforeEach(() => {
        mocker
          .httpMock(fakeUrl)
          .get(fakePath)
          .reply({}, 500)
      })

      it('should reject statusCode 500', done => {
        axios.get(`${fakeUrl}${fakePath}`).catch(({response}) => {
          expect(response.status).to.be.eq(500)
          done()
        })
      })
    })

    describe('when mocking with PATCH method', () => {
      beforeEach(() => {
        mocker
          .httpMock(fakeUrl)
          .patch(fakePath)
          .reply({})
      })

      it('should resolve statusCode 200', done => {
        axios.patch(`${fakeUrl}${fakePath}`).then(({status}) => {
          expect(status).to.be.eq(200)
          done()
        })
      })
    })
  })
})

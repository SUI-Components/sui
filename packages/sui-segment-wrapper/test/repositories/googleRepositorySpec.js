import {expect} from 'chai'
import sinon from 'sinon'

import {getCampaignDetails, getGoogleConsentValue} from '../../src/repositories/googleRepository.js'
describe('GoogleRepository', () => {
  let initialTrackingTagsType

  function setupLocation(queryParams) {
    const url = `/?${queryParams}`
    window.history.pushState({}, '', url)
  }

  function setupUseUtm(value) {
    window.__mpi.segmentWrapper.trackingTagsType = value
  }

  beforeEach(() => {
    initialTrackingTagsType = window.__mpi?.segmentWrapper?.trackingTagsType
  })

  afterEach(() => {
    setupUseUtm(initialTrackingTagsType)
  })

  it('should get campaign details with all details from STC', async () => {
    setupLocation('stc=em-source_type-campaign_name-content_type-term_type')

    const details = await getCampaignDetails()

    expect(details).to.not.be.null
    expect(details).to.have.property('campaign_medium', 'email')
    expect(details).to.have.property('campaign_name', 'campaign_name')
    expect(details).to.have.property('campaign_source', 'source_type')
    expect(details).to.have.property('campaign_content', 'content_type')
    expect(details).to.have.property('campaign_term', 'term_type')
  })

  it('should get medium without transformation from STC', async () => {
    setupLocation('stc=custom_medium-source_type-campaign_id:campaing_name-content_type')

    const details = await getCampaignDetails({needsTransformation: false})

    expect(details).to.have.property('campaign_medium', 'custom_medium')
  })

  it('should get campaign id from STC', async () => {
    setupLocation('stc=em-source_type-campaign_id:campaing_name-content_type')

    const details = await getCampaignDetails()

    expect(details).to.have.property('campaign_name', 'campaing_name')
  })

  it('should not return content with invalid content type', async () => {
    setupLocation('stc=em-source_type-campaign_name-na')

    const details = await getCampaignDetails()

    expect(details).to.not.have.property('content')
  })

  it('should return null when no STC param present', async () => {
    setupLocation('')

    const details = await getCampaignDetails()

    expect(details).to.be.null
  })

  it('should return null when have no campaign in STC', async () => {
    setupLocation('?stc=em-source_type')

    const details = await getCampaignDetails()

    expect(details).to.be.null
  })

  it('should return null when having invalid campaign name no campaign in STC', async () => {
    setupLocation('?stc=em-source_type-:')

    const details = await getCampaignDetails()

    expect(details).to.be.null
  })

  it('should get campaign details with all details from UTM', async () => {
    setupUseUtm('utm')
    setupLocation(
      'utm_medium=em&utm_source=source_type&utm_campaign=campaign_name&utm_content=content_type&utm_term=term_type'
    )
    const details = await getCampaignDetails()

    expect(details).to.not.be.null
    expect(details).to.have.property('campaign_medium', 'email')
    expect(details).to.have.property('campaign_name', 'campaign_name')
    expect(details).to.have.property('campaign_source', 'source_type')
    expect(details).to.have.property('campaign_content', 'content_type')
    expect(details).to.have.property('campaign_term', 'term_type')
  })

  it('should get medium without transformation from UTM', async () => {
    setupUseUtm('utm')
    setupLocation(
      'utm_medium=custom_medium&utm_source=source_type&utm_campaign=campaign_name&utm_content=content_type&utm_term=term_type'
    )

    const details = await getCampaignDetails({needsTransformation: false})

    expect(details).to.have.property('campaign_medium', 'custom_medium')
  })

  it('should get campaign id from UTM', async () => {
    setupUseUtm('utm')
    setupLocation(
      'utm_medium=em&utm_source=source_type&utm_campaign=campaign_name&utm_id=campaign_id&utm_content=content_type&utm_term=term_type'
    )

    const details = await getCampaignDetails()

    expect(details).to.have.property('campaign_name', 'campaign_name')
  })

  it('should return null when no UTM mandatory params are present', async () => {
    setupUseUtm('utm')
    setupLocation('')

    const details = await getCampaignDetails()

    expect(details).to.be.null
  })

  it('should fallback to stc if utm_medium is empty', async () => {
    setupUseUtm('utm')
    setupLocation('stc=stc_medium-stc_source-stc_campaign&utm_source=utm_source&utm_campaign=utm_campaign')

    const details = await getCampaignDetails({needsTransformation: false})

    expect(details).to.have.property('campaign_medium', 'stc_medium')
    expect(details).to.have.property('campaign_source', 'stc_source')
    expect(details).to.have.property('campaign_name', 'stc_campaign')
  })

  it('should fallback to stc if utm_source is empty', async () => {
    setupUseUtm('utm')
    setupLocation('stc=stc_medium-stc_source-stc_campaign&utm_medium=utm_medium&utm_campaign=utm_campaign')

    const details = await getCampaignDetails({needsTransformation: false})

    expect(details).to.have.property('campaign_medium', 'stc_medium')
    expect(details).to.have.property('campaign_source', 'stc_source')
    expect(details).to.have.property('campaign_name', 'stc_campaign')
  })

  it('should fallback to stc if utm_campaign is empty', async () => {
    setupUseUtm('utm')
    setupLocation('stc=stc_medium-stc_source-stc_campaign&utm_medium=utm_medium&utm_source=utm_source')

    const details = await getCampaignDetails({needsTransformation: false})

    expect(details).to.have.property('campaign_medium', 'stc_medium')
    expect(details).to.have.property('campaign_source', 'stc_source')
    expect(details).to.have.property('campaign_name', 'stc_campaign')
  })

  describe('getGoogleConsentValue', () => {
    let getConsentStateStub

    beforeEach(() => {
      // Ensure the nested structure exists before stubbing
      if (!window.google_tag_data) {
        window.google_tag_data = {ics: {}}
      } else if (!window.google_tag_data.ics) {
        window.google_tag_data.ics = {}
      }
      // Ensure the property exists so sinon.stub doesn't throw
      window.google_tag_data.ics.getConsentState = function () {}
      getConsentStateStub = sinon.stub(window.google_tag_data.ics, 'getConsentState')
    })

    afterEach(() => {
      if (getConsentStateStub && typeof getConsentStateStub.restore === 'function') {
        getConsentStateStub.restore()
      }
      delete window.google_tag_data
    })

    it("should return 'granted' when GTM consent state is 1", () => {
      // Given
      getConsentStateStub.returns(1)
      // When
      const consentValue = getGoogleConsentValue('analytics_storage')
      // Then
      expect(consentValue).to.equal('granted')
      expect(getConsentStateStub.calledOnceWith('analytics_storage')).to.be.true
    })

    it("should return 'denied' when GTM consent state is 2", () => {
      // Given
      getConsentStateStub.returns(2)
      // When
      const consentValue = getGoogleConsentValue('ad_storage')
      // Then
      expect(consentValue).to.equal('denied')
      expect(getConsentStateStub.calledOnceWith('ad_storage')).to.be.true
    })

    it('should return undefined if the GTM API returns a value other than 1 or 2', () => {
      // Given
      getConsentStateStub.returns(0) // An unexpected value
      // When
      const consentValue = getGoogleConsentValue('ad_user_data')
      // Then
      expect(consentValue).to.be.undefined
    })

    it('should return undefined if the GTM API is not available', () => {
      // Given
      getConsentStateStub.restore() // Remove the stub to simulate the API not being there
      delete window.google_tag_data
      // When
      const consentValue = getGoogleConsentValue('ad_personalization')
      // Then
      expect(consentValue).to.be.undefined
    })

    it('should return undefined if getConsentState is not a function', () => {
      // Given
      getConsentStateStub.restore() // Remove the stub
      window.google_tag_data.ics = {} // getConsentState is missing
      // When
      const consentValue = getGoogleConsentValue('analytics_storage')
      // Then
      expect(consentValue).to.be.undefined
    })
  })
})

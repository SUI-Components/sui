import {expect} from 'chai'

import {getCampaignDetails} from '../../src/repositories/googleRepository.js'
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
    expect(details.campaign).to.have.property('medium', 'email')
    expect(details.campaign).to.have.property('name', 'campaign_name')
    expect(details.campaign).to.have.property('source', 'source_type')
    expect(details.campaign).to.have.property('content', 'content_type')
    expect(details.campaign).to.have.property('term', 'term_type')
  })

  it('should get medium without transformation from STC', async () => {
    setupLocation('stc=custom_medium-source_type-campaign_id:campaing_name-content_type')

    const details = await getCampaignDetails({needsTransformation: false})

    expect(details.campaign).to.have.property('medium', 'custom_medium')
  })

  it('should get campaign id from STC', async () => {
    setupLocation('stc=em-source_type-campaign_id:campaing_name-content_type')

    const details = await getCampaignDetails()

    expect(details.campaign).to.have.property('name', 'campaing_name')
  })

  it('should not return content with invalid content type', async () => {
    setupLocation('stc=em-source_type-campaign_name-na')

    const details = await getCampaignDetails()

    expect(details.campaign).to.not.have.property('content')
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
    expect(details.campaign).to.have.property('medium', 'email')
    expect(details.campaign).to.have.property('name', 'campaign_name')
    expect(details.campaign).to.have.property('source', 'source_type')
    expect(details.campaign).to.have.property('content', 'content_type')
    expect(details.campaign).to.have.property('term', 'term_type')
  })

  it('should get medium without transformation from UTM', async () => {
    setupUseUtm('utm')
    setupLocation(
      'utm_medium=custom_medium&utm_source=source_type&utm_campaign=campaign_name&utm_content=content_type&utm_term=term_type'
    )

    const details = await getCampaignDetails({needsTransformation: false})

    expect(details.campaign).to.have.property('medium', 'custom_medium')
  })

  it('should get campaign id from UTM', async () => {
    setupUseUtm('utm')
    setupLocation(
      'utm_medium=em&utm_source=source_type&utm_campaign=campaign_name&utm_id=campaign_id&utm_content=content_type&utm_term=term_type'
    )

    const details = await getCampaignDetails()

    expect(details.campaign).to.have.property('name', 'campaign_name')
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

    expect(details.campaign).to.have.property('medium', 'stc_medium')
    expect(details.campaign).to.have.property('source', 'stc_source')
    expect(details.campaign).to.have.property('name', 'stc_campaign')
  })

  it('should fallback to stc if utm_source is empty', async () => {
    setupUseUtm('utm')
    setupLocation('stc=stc_medium-stc_source-stc_campaign&utm_medium=utm_medium&utm_campaign=utm_campaign')

    const details = await getCampaignDetails({needsTransformation: false})

    expect(details.campaign).to.have.property('medium', 'stc_medium')
    expect(details.campaign).to.have.property('source', 'stc_source')
    expect(details.campaign).to.have.property('name', 'stc_campaign')
  })

  it('should fallback to stc if utm_campaign is empty', async () => {
    setupUseUtm('utm')
    setupLocation('stc=stc_medium-stc_source-stc_campaign&utm_medium=utm_medium&utm_source=utm_source')

    const details = await getCampaignDetails({needsTransformation: false})

    expect(details.campaign).to.have.property('medium', 'stc_medium')
    expect(details.campaign).to.have.property('source', 'stc_source')
    expect(details.campaign).to.have.property('name', 'stc_campaign')
  })
})

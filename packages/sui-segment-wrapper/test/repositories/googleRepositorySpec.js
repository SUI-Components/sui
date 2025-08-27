import {expect} from 'chai'

import {getCampaignDetails} from '../../src/repositories/googleRepository.js'
describe('GoogleRepository', () => {
  function setupLocation(queryParams) {
    const url = `/?${queryParams}`
    window.history.pushState({}, '', url)
  }

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
})

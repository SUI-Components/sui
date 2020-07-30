/* global cy */

describe('SUI Studio', () => {
  it('should render a Title', () => {
    cy.visit('/')
    cy.contains('sample-studio')
  })

  it('should show component Playground, Readme, Api, Changelog', () => {
    cy.visit('/')
    cy.contains('button').click()

    cy.contains('AtomButton')

    cy.contains('Readme').click()
    cy.contains('$ npm install @sample-studio/sui-atom-button')

    cy.contains('Api').click()
    cy.contains("This component doesn't have props")

    cy.contains('Changelog').click()
    cy.contains('Change Log')
  })
})

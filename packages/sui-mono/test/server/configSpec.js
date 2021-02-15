import {expect} from 'chai'
import {factoryConfigMethods} from '../../src/config'

describe.only('config', () => {
  describe('checkIsMonoPackage', () => {
    it('returns true if no workspaces are in package config', () => {
      const {checkIsMonoPackage} = factoryConfigMethods({name: 'project'})
      expect(checkIsMonoPackage()).to.equal(true)
    })

    it('returns true if workspaces are empty in package config', () => {
      const {checkIsMonoPackage} = factoryConfigMethods({
        name: 'project',
        workspaces: []
      })
      expect(checkIsMonoPackage()).to.equal(true)
    })

    it('returns false if workspaces are listed in package config', () => {
      const {checkIsMonoPackage} = factoryConfigMethods({
        name: 'project',
        workspaces: ['components/**']
      })
      expect(checkIsMonoPackage()).to.equal(false)
    })
  })

  describe('getChangelogFilename', () => {})

  describe('getProjectName', () => {})

  describe('getPublishAccess', () => {})

  describe('getWorkspaces', () => {})
})

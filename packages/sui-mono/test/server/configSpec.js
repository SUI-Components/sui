import {expect} from 'chai'
import {factoryConfigMethods} from '../../src/config'

describe('config', () => {
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

  describe('getChangelogFilename', () => {
    it('returns the correct changelog filename', () => {
      const {getChangelogFilename} = factoryConfigMethods({
        name: 'project',
        workspaces: ['components/**']
      })
      expect(getChangelogFilename()).to.equal('CHANGELOG.md')
    })
  })

  describe('getProjectName', () => {
    it('returns the project name', () => {
      const {getProjectName} = factoryConfigMethods({
        name: 'project',
        workspaces: ['components/**']
      })
      expect(getProjectName()).to.equal('project')
    })
  })

  describe('getPublishAccess', () => {
    it('returns the access of the project if public', () => {
      const {getPublishAccess} = factoryConfigMethods({
        config: {
          'sui-mono': {
            access: 'public'
          }
        },
        workspaces: ['components/**']
      })
      expect(getPublishAccess()).to.equal('public')
    })

    it('returns the access as restricted of the project if not defined', () => {
      const {getPublishAccess} = factoryConfigMethods({
        config: {
          'sui-mono': {
            access: 'restricted'
          }
        },
        workspaces: ['components/**']
      })
      expect(getPublishAccess()).to.equal('restricted')
    })

    it('returns the access of the project if private', () => {
      const {getPublishAccess} = factoryConfigMethods({
        config: {
          'sui-mono': {
            access: 'restricted'
          }
        },
        workspaces: ['components/**']
      })
      expect(getPublishAccess()).to.equal('restricted')
    })
  })

  describe('getWorkspaces', () => {
    it('returns a list of workspaces if config provided and makes sense', () => {
      const {getWorkspaces} = factoryConfigMethods({
        workspaces: ['packages/**']
      })
      const workspaces = getWorkspaces()
      expect(workspaces.length > 0).to.equal(true)
    })

    it('returns an empty array of workspaces if config provided but nothing exist', () => {
      const {getWorkspaces} = factoryConfigMethods({
        workspaces: ['non-existent-folder/**']
      })
      const workspaces = getWorkspaces()
      expect(workspaces.length === 0).to.equal(true)
    })

    it('returns Root workspace if config not provided', () => {
      const {getWorkspaces} = factoryConfigMethods({})
      const workspaces = getWorkspaces()
      expect(workspaces).to.deep.equal(['Root'])
    })
  })
})

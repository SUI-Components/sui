#!/usr/bin/env node
/* eslint-disable no-console */
'use strict'

const OPTIONS = { overwrite: 1 }
const log = console.log
const Validate = require('git-validate')

log('[start] sui-precommit')

Validate.installScript('lint:js', 'sui-lint js', OPTIONS)
Validate.installScript('lint:sass', 'sui-lint sass', OPTIONS)
Validate.installScript('lint', 'npm run lint:js && npm run lint:sass', OPTIONS)

log('Scripts added! Add hooks and configure them')
Validate.installHooks('pre-commit')
Validate.configureHook('pre-commit', ['lint', 'test'])

log('Pre-commit-rules completely configured')
log('[finished] sui-precommit\n')

#!/usr/bin/env node
/* eslint-disable no-console */
'use strict'

const OPTIONS = { overwrite: 1 }
const log = console.log
const Validate = require('git-validate')

log('[start] frontend-pre-commit-rules')

Validate.installScript('lint:js', 'linting-rules js', OPTIONS)
Validate.installScript('lint:sass', 'linting-rules sass', OPTIONS)
Validate.installScript('lint', 'npm run lint:js && npm run lint:sass', OPTIONS)

log('Scripts added! Add hooks and configure them')
Validate.installHooks('pre-commit')
Validate.configureHook('pre-commit', ['lint', 'test'])

log('Pre-commit-rules completely configured')
log('[finished] frontend-pre-commit-rules\n')

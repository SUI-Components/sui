#!/usr/bin/env node

const args = process.argv.slice(2)

const config = []

require('jest').run([...config, ...args])

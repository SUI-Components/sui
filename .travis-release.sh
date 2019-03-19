#!/bin/sh

git config --global user.email "cloud-accounts@scmspain.com"
git config --global user.name "sui-bot"

# Remove existing "origin"
git remote rm origin
# Add new "origin" with access token in the git URL for authentication
git remote add origin https://sui-bot:${GH_TOKEN}@github.com/SUI-Components/sui.git > /dev/null 2>&1

# release new packages
npm run release
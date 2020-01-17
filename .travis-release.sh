#!/bin/sh

# get all the commits log for creating the correct Changelog
git pull --unshallow 2>&1 >/dev/null
# define names
git config --global user.email "cloud-accounts@scmspain.com"
git config --global user.name "sui-bot"
# Remove existing "origin"
git remote rm origin
# Add new "origin" with access token in the git URL for authentication
git remote add origin https://sui-bot:${GH_TOKEN}@github.com/SUI-Components/sui.git > /dev/null 2>&1
# move to master before release
git checkout master
# get the latest master changes
git pull origin master
# release new packages
./node_modules/.bin/sui-mono release
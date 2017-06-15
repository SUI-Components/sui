# SUI (Schibsted User Interface)

Monorepo to group SUI family packages altogether.

## Migration of multiple repositories

This monorepo was built to migrate current packages in separated repos.
The current npm scope is `@schibstedspain`, but should be migrated to `@sui`.
This repo should be migrated to https://github.com/sui/sui as well.

### Migration status of sui packages migration

| Final name | Temporary name | Origin |
| -- | -- | -- |
| @sui/component-dependencies| N/A | @schibstedspain/suistudio-fatigue-deps |
| @sui/babel-preset-sui | N/A | babel-preset-schibsted-spain |
| @sui/lint | N/A | @schibstedspain/linting-rules |
| @sui/precommit | N/A | @schibstedspain/frontend-pre-commit-rules |
| @sui/studio | N/A | @schibstedspain/sui-studio |
| @sui/bundler | N/A | @schibstedspain/suistudio-webpack |
| @sui/mono | @schibstedspain/sui-mono | @schibstedspain/commit-release-manager |
| @sui/cz | @schibstedspain/sui-cz | cz-crm |
| @sui/i18n | N/A | @schibstedspain/rosetta |
| @sui/ssr | N/A | @schibstedspain/ssr |
| @sui/decorators | N/A | @schibstedspain/cv-decorators |
| @sui/react-domain-connector | N/A | @schibstedspain/ddd-react-redux |

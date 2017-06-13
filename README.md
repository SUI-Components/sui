# SUI (Schibsted User Interface)

Monorepo to group SUI family packages altogether.

## Migration of multiple repositories

This monorepo was built to migrate current packages in separated repos.
The current npm scope is `@schibstedspain`, but should be migrated to `@sui`.
This repo should be migrated to https://github.com/sui/sui as well.

### Migration status of sui packages migration

| Final name | Temporary name | Origin |
| -- | -- | -- |
| @sui/dependencies| N/A | @schibstedspain/suistudio-fatigue-deps |
| @sui/dev-dependencies | N/A | @schibstedspain/suistudio-fatigue-dev |
| @sui/babel-preset | N/A | babel-preset-schibsted-spain |
| @sui/lint | N/A | @schibstedspain/linting-rules |
| @sui/precommit | N/A | @schibstedspain/frontend-pre-commit-rules |
| @sui/components-studio | N/A | @schibstedspain/sui-studio |
| @sui/webpack-build | N/A | @schibstedspain/suistudio-webpack |
| @sui/mono | @schibstedspain/sui-mono | @schibstedspain/commit-release-manager |
| @sui/mono-cz | @schibstedspain/sui-mono-cz | cz-crm |
| @sui/rosetta or @sui/i18n | N/A | @schibstedspain/rosetta |
| @sui/ssr | N/A | @schibstedspain/ssr |
| @sui/decorator-cache or @sui/decorator-streamify | N/A | @schibstedspain/cv-decorators |
| @sui/react-domain-connector | N/A | @schibstedspain/ddd-react-redux |

# SUI Components Theme

This repository contains:

- Generic variables to initialize default values and component styles.
- A set of placeholders ready to style your component (buttons, tabs, forms, grid system...).
- Functions and mixins helpers.

## Usage

Install `sui-theme` in your project:

```bash
npm install @s-ui/theme --save
```

Import `sui-theme` into your sui-component including the path in `index.scss`:

```scss
@import '~@s-ui/theme/lib/index';
```

If you want to customize your components, create your own theme and add it to your component just **before** the sui-theme import.

```scss
@import '../custom-settings';
@import '~@s-ui/theme/lib/index';
```

## Upgrade from theme-basic@8 to theme@9

rgba

Compatibility v7 variables are no longer available to import manually.

## Media queries and breakpoints

### Rules & Definitions

- Breakpoints must be exactly `xxs`, `xs`, `s`, `m`, `l`, `xl`, `xxl`
- For new implementations, the only allowed media query is `media-breakpoint-up`
- `media-breakpoint-down`, `media-breakpoint-only` and `media-breakpoint-between` are removed.

### Reason

- We want to create all our components `mobile first`

> Read more at [settings-compat-v7.md](src/settings-compat-v7.md)

### Legacy components

- Keep in mind that refactoring legacy components in order to make it rules compliant would suppose a breaking change, so a new major must be released.

### Links

- [SUI Breakpoints](https://github.com/SUI-Components/sui-theme/blob/master/src/layout/_breakpoints.scss) implementation
- [SUI Media Query](https://github.com/SUI-Components/sui-theme/blob/master/src/utils/_breakpoints.scss) implementation

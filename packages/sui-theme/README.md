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

## Upgrade from theme-basic@7

Compatibility variables are still available to import manually.

**Import only what you need, in inheritance order**

For instance:

```scss
@import '../custom-settings';
@import '~@s-ui/theme/lib/settings-compat-v7/color';
@import '~@s-ui/theme/lib/settings-compat-v7/spacing';
@import '~@s-ui/theme/lib/index';
```

Find below the compat varible groups available:

- [settings-compat-v7/color](https://github.com/SUI-Components/sui-theme/blob/master/src/settings-compat-v7/_color.scss)
- [settings-compat-v7/font](https://github.com/SUI-Components/sui-theme/blob/master/src/settings-compat-v7/_font.scss)
- [settings-compat-v7/spacing](https://github.com/SUI-Components/sui-theme/blob/master/src/settings-compat-v7/_spacing.scss)
- [settings-compat-v7/box-style](https://github.com/SUI-Components/sui-theme/blob/master/src/settings-compat-v7/_box-style.scss)
- [settings-compat-v7/animation](https://github.com/SUI-Components/sui-theme/blob/master/src/settings-compat-v7/_animation.scss)
- [settings-compat-v7/layout](https://github.com/SUI-Components/sui-theme/blob/master/src/settings-compat-v7/_layout.scss)
- [settings-compat-v7/components](https://github.com/SUI-Components/sui-theme/blob/master/src/settings-compat-v7/_components.scss)

**Also, if you need it all for older components, you can do**

```scss
@import '~@s-ui/theme/lib/settings-compat-v7/index';
@import '~@s-ui/theme/lib/index';
```

## Media queries and breakpoints

### Rules & Definitions

- Breakpoints must be exactly `xxs`, `xs`, `s`, `m`, `l`, `xl`, `xxl`
- For new implementations, the only allowed media query is `media-breakpoint-up`
- `media-breakpoint-down`, `media-breakpoint-only` and `media-breakpoint-between` are deprecated and only kept for legacy reasons.

### Reason

- We want to create all our components `mobile first`

### Legacy components

- Keep in mind that refactoring legacy components in order to make it rules compliant would suppose a breaking change, so a new major must be released.

### Links

- [SUI Breakpoints](https://github.com/SUI-Components/sui-theme/blob/master/src/layout/_breakpoints.scss) implementation
- [SUI Media Query](https://github.com/SUI-Components/sui-theme/blob/master/src/utils/_breakpoints.scss) implementation

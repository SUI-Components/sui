# TOKENS

## _animation.scss

### Transitions

> `$trsdu-base`: removed
> 
> `$trsdu-slow`: removed
> 
> `$trsdu-fast`: removed
> 
> `$trs-base`: removed

## _box-style.scss

### Border radius

> `$bdrs-none`: included
> 
> `$bdrs-small`: removed

### Box shadows

> `$bxsh-spread`: removed
>
> `$bxsh-base`: removed

## _color.scss

### Colors

#### Colors non-existing in the new color palette

> `$c-highlighted`: replaced by `$c-highlight`
> 
> `$c-featured`: removed
> 
> `$c-white`: included
> 
> `$c-black`: included

#### Colors renamed in the new color palette

> `$c-warning`: replaced by $c-alert

## _components.scss

### Forms

#### Inputs

> `$bgc-input`: replaced by `$bgc-atom-input`
> 
> `$bgc-input-hover`: removed
> 
> `$bgc-input-focus`: removed
> 
> `$bdrs-input`: renamed to `$bdrs-atom-input`
> 
> `$c-input`: replaced by `$c-atom-input`
> 
> `$c-input-focus`: removed
> 
> `$c-input-hover`: removed
> 
> `$c-input-placeholder`: removed
> 
> `$ff-input-placeholder`: removed
> 
> `$fs-input-placeholder`: removed
> 
> `$lh-input`: removed, by default it was `$lh-xxl`

> `$bd-input`: replaced by `$bd-atom-input-base`
> 
> `$bd-input-hover`: removed
> 
> `$bd-input-focus`: removed

#### Radio List

> `$bd-radio-list`: removed
> 
> `$bdrs-radio-list`: removed

> `$bgc-radio-list-checked`: removed
> 
> `$bgc-radio-list`: removed

> `$c-radio-list-checked`: removed
> 
> `$p-radio-list`: removed

#### Selects

> `$bgc-select`: replaced by `$bgc-atom-input`
> 
> `$bgc-select-hover`: removed
> 
> `$bgc-select-focus`: removed
> 
> `$lh-select`: removed. Set `$lh-xxl`;

> `$bgc-select-icon-wrap`: removed. Set `$c-gray-lightest;
> 
> `$p-select-icon-wrap`: removed
> 
> `$w-select-icon-wrap`: removed. Set `$sz-icon-l`

> `$bxsh-select`: removed
> 
> `$bxsh-select-hover`: removed
> 
> `$bxsh-select-focus`: removed

### Components

#### Ads

> `$h-ad-l-top`: removed
> `$w-ad-l-top`: removed
> `$h-ad-l-right`: removed
> `$w-ad-l-right`: removed
> `$mih-ad-l-top`: removed

#### Alert Basic

> `$bdrs-alert-basic`
> 
> `$bxsh-alert-basic`: removed
> 
> `$c-alert-basic-link`: removed

> `$c-alert-basic-info`: removed
> 
> `$bd-alert-basic-info`: removed
> 
> `$bdl-alert-basic-info`: removed
> 
> `$bgc-alert-basic-info`: removed

> `$c-alert-basic-error`: removed
> 
> `$bd-alert-basic-error`: removed
> 
> `$bdl-alert-basic-error`: removed
> 
> `$bgc-alert-basic-error`: removed

> `$c-alert-basic-success`: removed
> 
> `$bd-alert-basic-success`: removed
> 
> `$bdl-alert-basic-success`: removed
> 
> `$bgc-alert-basic-success`: removed

#### Badge

> `$c-badge-notification`: removed. $c-primary
> 
> `$size-badge-notification`: removed. Set `math.div(2, 3) * $sz-base`
> 
> `$p-badge-notification`: removed. Set `0 math.div(1, 3) * $sz-base`
> 
> `$m-badge-notification`: removed
> 
> `$bd-badge-notification`: removed

#### Button

> `$bdrs-button`: removed
> 
> `$lh-button`: removed
> 
> `$o-button-disabled`: removed

> `$c-button-primary`: removed
> 
> `$c-button-primary-icon-fill`: removed
> 
> `$c-button-primary-icon-stroke`: removed
> 
> `$bgc-button-primary`: removed
> 
> `$bgc-button-primary-hover`: removed
> 
> `$bgc-button-primary-active`: removed

> `$c-button-secondary`: removed
> 
> `$c-button-secondary-hover`: removed
> 
> `$c-button-secondary-icon-fill`: removed
> 
> `$c-button-secondary-icon-stroke`: removed
> 
> `$bdc-button-secondary`: removed
> 
> `$bgc-button-secondary`: removed
> 
> `$bgc-button-secondary-hover`: removed
> 
> `$bgc-button-secondary-active`: removed

> `$c-button-accent`: removed
> 
> `$c-button-accent-icon-fill`: removed
> 
> `$c-button-accent-icon-stroke`: removed
> 
> `$bgc-button-accent`: removed
> 
> `$bgc-button-accent-hover`: removed
> 
> `$bgc-button-accent-active`: removed

> `$c-button-ghost`: removed
> 
> `$c-button-ghost-hover`: removed
> 
> `$c-button-ghost-icon-fill`: removed
> 
> `$c-button-ghost-icon-stroke`: removed
> 
> `$bdc-button-ghost`: removed
> 
> `$bdc-button-ghost-hover`: removed
> 
> `$bgc-button-ghost-active`: removed

> `$c-button-flat`: removed
> 
> `$c-button-flat-hover`: removed
> 
> `$c-button-flat-icon-fill`: removed
> 
> `$c-button-flat-icon-stroke`: removed
> 
> `$bgc-button-flat-active`: removed

#### Card

> `$bdc-article-featured`: removed
> 
> `$bd-article-featured`: removed
> 
> `$bdrs-card`: removed
> 
> `$bxsh-card`: removed
> 
> `$bxsh-card-hover`: removed
> 
> `$c-card-article-description`: removed
> 
> `$c-card-article-icon-fill`: removed
> 
> `$c-card-title-hover`: removed
> 
> `$z-card-article-icon`: removed

#### Card composable

> `$bgc-card-composable`: removed
> 
> `$p-card-composable-primary`: removed
> 
> `$p-card-composable-secondary`: removed

#### Card product

> `$c-card-product-title`: removed
> 
> `$c-card-product-favorited`: removed
> 
> `$c-card-product-slider-nav-icon`: removed
> 
> `$size-card-product-slider-nav-icon`: removed


#### Card subscription

> `$bg-card-subscription-image`: removed
> 
> `$bgc-card-subscription-content`: removed
> 
> `$c-card-subscription-icon`: removed
> 
> `$c-card-subscription-title`: removed
> 
> `$fz-card-subscription-input`: removed
> 
> `$h-card-subscription-image`: removed
> 
> `$pt-card-subscription`: removed
> 
> `$t-card-subscription-image`: removed
> 
> `$type-card-subscription-button`: removed

#### Cookie banner

> `$bgc-cookie-banner`: removed
> 
> `$c-cookie-banner`: removed
> 
> `$fz-cookie-banner`: removed
> 
> `$z-cookie-banner`: removed

> `$maw-cookie-banner-content`: removed
> 
> `$p-cookie-banner-content`: removed
> 
> `$ta-cookie-banner-context`: removed

> `$c-cookie-banner-link`: removed

> `$c-cookie-banner-close-icon`: removed
> 
> `$c-cookie-banner-close-icon-hover`: removed

#### Dropdown

> `$c-dropdown-button-large`: removed
> 
> `$bdt-dropdown-menu`: removed
> 
> `$bgc-dropdown-button-hover`: removed
> 
> `$bgc-dropdown-menu-hover`: removed
> 
> `$bgc-dropdown-menu`: removed
> 
> `$bxsh-dropdown-menu`: removed
> 
> `$c-dropdown-arrow`: removed
> 
> `$size-dropdown-arrow-up`: removed
> 
> `$size-dropdown-icon`: removed
> 
> `$z-dropdown-menu`: kept under layers.scss

#### Dropdown basic

> `$bdrs-dropdown-basic-menu`: removed
> 
> `$c-dropdown-basic-button-hover`: removed
> 
> `$c-dropdown-basic-button-icon`: removed
> 
> `$c-dropdown-basic-list-link`: removed
> 
> `$fw-dropdown-basic-button`: removed

#### Dropdown user

> `$bd-dropdown-user-last-item`: removed
> 
> `$bdrs-dropdown-user-menu`: removed
> 
> `$bg-dropdown-user-button`: removed
> 
> `$bgc-dropdown-user`: removed
> 
> `$c-dropdown-user-icon-highlight`: removed
> 
> `$c-dropdown-user-icon-hover`: removed
> 
> `$c-dropdown-user-link-highlight`: removed
> 
> `$c-dropdown-user-text-large`: removed
> 
> `$w-dropdown-user-avatar`: removed
> 
> `$w-dropdown-user-text`: removed

#### Form Autocompleted

> `$bd-form-autocompleted`: removed
> 
> `$bdr-form-autocompleted`: removed
> 
> `$bgc-form-autocompleted-item-active`: removed
> 
> `$bgc-form-autocompleted-item-hover`: removed
> 
> `$bgc-form-autocompleted`: removed
> 
> `$c-form-autocompleted-submit-icon`: removed
> 
> `$ml-form-autocompleted-submit`: removed
> 
> `$mt-form-autocompleted`: removed
> 
> `$p-form-autocompleted-item`: removed
> 
> `$r-form-autocompleted-clear`: removed
> 
> `$t-form-autocompleted-clear`: removed
> 
> `$trf-form-autocompleted-clear`: removed
> 
> `$z-form-autocompleted-suggests`: removed
> 
> `$type-form-autocompleted-submit`: removed

#### Modal

> `$bg-modal`: removed

#### Modal Basic

> `$bd-modal-basic`: removed
> 
> `$bg-modal-basic`: removed
> 
> `$bxsh-modal-basic`: removed
> 
> `$m-modal-basic`: removed
> 
> `$maw-modal-basic`: removed
> 
> `$p-modal-basic`: removed
> 
> `$w-modal-basic`: removed
> 
> `$z-modal-basic`: removed
> 
> `$c-modal-basic-icon`: removed
> 
> `$h-modal-basic-icon`: removed
> 
> `$w-modal-basic-icon`: removed
> 
> `$bg-modal-basic-dialog`: removed
> 
> `$bg-modal-basic-header`: removed
> 
> `$c-modal-basic-header`: removed
> 
> `$p-modal-basic-header`: removed
> 
> `$m-modal-basic-header`: removed
> 
> `$bd-modal-basic-content`: removed
> 
> `$p-modal-basic-content`: removed
> 
> `$p-modal-basic-footer`: removed

#### Search box

> `$bg-search-box`: removed

#### Section

> `$c-section-basic-main-title`: removed
> 
> `$c-section-basic-subtitle`: removed
> 
> `$c-section-basic-content-text-paragraph`: removed
> 
> `$fz-section-basic-title`: removed
> 
> `$fz-section-basic-subtitle`: removed
> 
> `$fz-section-basic-content-text-paragraph`: removed
> 
> `$lh-section-basic-paragraph`: removed
> 
> `$mb-section-basic`: removed
> 
> `$mb-section-basic-header`: removed
> 
> `$m-v-section-basic-content-text-paragraph`: removed
> 
> `$bd-section-basic-line-separator`: removed

#### Smartbanner

> $bgc-ad-smartbanner
> 
> `$bb-ad-smartbanner`: removed
> 
> `$h-ad-smartbanner`: removed
> 
> `$t-ad-smartbanner`: removed
> 
> `$b-ad-smartbanner`: removed
> 
> `$l-ad-smartbanner`: removed
> 
> `$z-ad-smartbanner`: removed
> 
> `$m-ad-smartbanner-logo`: removed
> 
> `$w-ad-smartbanner-logo`: removed
> 
> `$h-ad-smartbanner-logo`: removed
> 
> `$bdrs-ad-smartbanner-logo`: removed
> 
> `$bgc-ad-smartbanner-button-install`: removed
> 
> `$c-ad-smartbanner-button-color`: removed
> 
> `$w-ad-smartbanner-button-close-icon`: removed
> 
> `$h-ad-smartbanner-button-close-icon`: removed
> 
> `$c-ad-smartbanner-button-close-icon`: removed
> 
> `$m-ad-smartbanner-button-close-container`: removed
> 
> `$fz-ad-smartbanner-title`: removed
> 
> `$fw-ad-smartbanner-title`: removed
> 
> `$m-ad-smartbanner-title`: removed
> 
> `$fz-ad-smartbanner-text`: removed
> 
> `$m-ad-smartbanner-text`: removed
> 
> `$p-ad-smartbanner-secondary`: removed
> 
> `$p-ad-smartbanner-rating-container`: removed
> 
> `$c-ad-smartbanner-rating-icon`: removed

#### Spinner

> `$c-spinner`: removed
> 
> `$m-spinner`: removed
> 
> `$op-spinner`: removed
> 
> `$animdur-spinner`: removed
> 
> `$animic-spinner`: removed
> 
> `$animtf-spinner`: removed

> `$size-spinner-l`: removed
> 
> `$bdw-spinner-l`: removed
> 
> `$size-spinner-m`: removed
> 
> `$bdw-spinner-m`: removed
> 
> `$size-spinner-s`: removed
> 
> `$bdw-spinner-s`: removed

#### Tabs

> `$bd-tab-wrap`: removed
> 
> `$bd-tab`: removed
> 
> `$bgc-tab`: removed
> 
> `$c-tab`: removed
> 
> `$fw-tab`: removed
> 
> `$mr-tab`: removed
> 
> `$p-tab`: removed
> 
> `$tt-tab`: removed

> `$bgc-tab-hover`: removed

> `$bgc-tab-active`: removed
> 
> `$bxsh-tab-active`: removed
> 
> `$c-tab-active`: removed

#### Tag

> `$c-tag`: removed
> 
> `$c-tag-selected`: removed
> 
> `$bd-tag`: removed
> 
> `$bd-tag-selected`: removed
> 
> `$bgc-tag`: removed
> 
> `$bgc-tag-hover`: removed
> 
> `$bgc-tag-selected`: removed
> 
> `$bdrs-tag`: removed
> 
> `$fz-tag`: removed
> 
> `$fw-tag-link`: removed
> 
> `$lh-tag`: removed
> 
> `$size-tag-icon`: removed

#### Title

> `$c-title-basic-main-title`: removed
> 
> `$c-title-basic-subtitle`: removed

#### Tooltip basic

> `$bdr-tooltip-basic`: removed
> 
> `$bdw-tooltip-basic-arrow`: removed
> 
> `$fz-tooltip-basic`: removed
> 
> `$w-toolip-basic-arrow`: removed
> 
> `$p-toolip-basic`: removed
> 
> `$trs-toolip-basic`: removed
> 
> `$bxsh-toolip-basic`: removed
> 
> `$maw-tooltip-basic`: removed

> `$bgc-tooltip-basic-dark`: removed
> 
> `$c-tooltip-basic-dark`: removed
> 
> `$bdc-tooltip-basic-dark`: removed

> `$bgc-tooltip-basic-success`: removed
> 
> `$c-tooltip-basic-success`: removed
> 
> `$bdc-tooltip-basic-success`: removed

> `$bgc-tooltip-basic-error`: removed
> 
> `$c-tooltip-basic-error`: removed
> 
> `$bdc-tooltip-basic-error`: removed

> `$bgc-tooltip-basic-info`: removed
> 
> `$c-tooltip-basic-info`: removed
> 
> `$bdc-tooltip-basic-info`: removed

#### Thumbnail

> `$bgc-thumbnail-basic`: removed
> 
> `$bd-thumbnail-basic`: removed
> 
> `$bdrs-thumbnail-basic`: removed
> 
> `$p-thumbnail-basic`: removed
> 
> `$bgc-thumbnail-basic-caption`: removed
> 
> `$c-thumbnail-basic-caption`: removed
> 
> `$fz-thumbnail-basic-caption`: removed
> 
> `$trs-thumbnail-basic`: removed
> 
> `$p-thumbnail-basic-caption`: removed

#### List

> `$m-list-gutter`: removed

## _font.scss

### Strip number

### Fonts and typography

#### Font weights

> `$fw-semi-bold`: maintained

#### Font sizes

> `$fz-base`: maintained
> 
> `$fz-body`: maintained
> 
> `$fz-xs`: maintained
> 
> `$fz-s`: maintained
> 
> `$fz-m`: maintained
> 
> `$fz-l`: maintained
> 
> `$fz-xl`: maintained

#### Font sizes for headings

> `$fz-h1`: maintained
> 
> `$fz-h2`: maintained
> 
> `$fz-h3`: maintained
> 
> `$fz-h4`: maintained
> 
> `$fz-h5`: maintained

#### Line heights

> `$lh-base`: removed

#### Text link

> `$td-text-link`: moved
> 
> `$td-hover-text-link`: moved
> 
> `$fz-text-link`: moved

## _layout.scss

### Layout

> `$w-layout`: removed
> 
> `$w-layout-large`: removed

### Breakpoints

> `$breakpoints`: included
> 
> `$breakpoint-names`: included

## _spacings.scss

#### Margins

> `$m-base`: included
> 
> `$m-v-xlarge`: removed
> 
> `$m-v-large`: removed
> 
> `$m-v`: removed
> 
> `$m-v-xsmall`: removed
> 
> `$m-v-small`: removed
> 
> `$m-h-xlarge`: removed
> 
> `$m-h-large`: removed
> 
> `$m-h`: removed
> 
> `$m-h-small`: removed
> 
> `$m-h-xsmall`: removed


#### Paddings

> `$p-base`: included
> 
> `$p-small`: removed
> 
> `$p-xsmall`: removed
> 
> `$p-xxsmall`: removed
> 
> `$p-v-xlarge`: removed
> 
> `$p-v-large`: removed
> 
> `$p-v`: removed
> 
> `$p-v-small`: removed
> 
> `$p-v-xsmall`: removed
> 
> `$p-h-xlarge`: removed
> 
> `$p-h-large`: removed
> 
> `$p-h`: removed
> 
> `$p-h-small`: removed
> 
> `$p-h-xsmall`: removed

#### Gutter

> $gutter: included
> 
> $gutter-s: included

## components/atom/input/_settings.scss

> `$pl-atom-input`: removed
> 
> `$pr-atom-input`: removed
    
> `$bxsh-atom-input-size`: removed. Set `$bxsh-focus-size`
>
> `$bxsh-atom-input`: removed
> 
> `$bd-atom-input`: removed
> 
> `$bd-atom-input-focus`: removed
> 
> `$fz-atom-input`: removed
> 
> `$bgc-atom-input`: moved to `@s-ui/react-atom-input`
> 
> `$c-atom-input`: moved to `@s-ui/react-atom-input`
> 
> `$bd-atom-input-base`: moved to `@s-ui/react-atom-input`

> `$bd-molecule-autosuggest-focus`: removed
> 
> `$bxsh-molecule-autosuggest-focus`: removed
> 
> `$ol-molecule-autosuggest-focus`: removed
> 
> `$olo-molecule-autosuggest-focus`: removed

> `$bd-atom-select-focus`: removed
> 
> `$bxsh-atom-select-focus`: removed
> 
> `$ol-atom-select-focus`: removed
> 
> `$olo-atom-select-focus`: removed

> `$h-atom-input--xl`: located in moved to `@s-ui/react-atom-input`
> 
> `$h-atom-input--l`: moved to `@s-ui/react-atom-input`
> 
> `$h-atom-input--m`: moved to `@s-ui/react-atom-input`
> 
> `$h-atom-input--s`: moved to `@s-ui/react-atom-input`
> 
> `$h-atom-input--xs`: moved to `@s-ui/react-atom-input`

> `$c-atom-input--success`: moved to `@s-ui/react-atom-input`
> 
> `$c-atom-input--error`: moved to `@s-ui/react-atom-input`
> 
> `$c-atom-input--alert`: moved to `@s-ui/react-atom-input`

> `$sizes-atom-input`: moved to `@s-ui/react-atom-input`
> 
> `$states-atom-input`: moved to `@s-ui/react-atom-input`

## components/thumbnail/_basic.scss

> `$jc-thumbnail-basic-image`: removed
> 
> `$ar-thumbnail-basic-image`: removed

# Mixins:

> `@mixin sui-atom-input-input`: removed
> 
> `@mixin sui-atom-input-input-focus`: removed
> 
> `@mixin sui-atom-input-select-focus`: removed
> 
> `@mixin sui-molecule-autosuggest-focus`: removed

> `@mixin sui-badge-notification-element`: removed
> 
> `@mixin sui-badge-notification`: removed

> `@mixin sui-button`: removed
> 
> `@mixin sui-button--primary`: removed
> 
> `@mixin sui-button--secondary`: removed
> 
> `@mixin sui-button--accent`: removed
> 
> `@mixin sui-button--ghost`: removed
> 
> `@mixin sui-button--flat`: removed
> 
> `@mixin sui-button--small`: removed
> 
> `@mixin sui-button--medium`: removed
> 
> `@mixin sui-button--large`: removed
> 
> `@mixin sui-button--full`: removed

> `@mixin sui-card`: removed
> 
> `@mixin sui-card--small`: removed

> `@mixin sui-icon--small`: removed
> 
> `@mixin sui-icon--medium`: removed
> 
> `@mixin sui-icon--large`: removed
> 
> `@mixin sui-icon--xlarge`: removed

> `@mixin sui-input`: removed

> `@mixin sui-select`: removed

> `@mixin sui-tab`: removed

> `@mixin sui-tag`: removed
> 
> `@mixin sui-tag-link`: removed
> 
> `@mixin sui-tag-icon`: removed

> `@mixin arrow-up`: removed
> 
> `@mixin arrow-down`: removed
> 
> `@mixin arrow-right`: removed
> 
> `@mixin arrow-left`: removed

> `@mixin media-breakpoint-down`: removed
>
> `@mixin media-breakpoint-between`: removed
>
> `@mixin media-breakpoint-only`: removed

## Placeholder Selectors

> `%sui-atom-input-input`
> 
> `%sui-atom-input-input-focus`
> 
> `%sui-atom-input-select-focus`
> 
> `%sui-molecule-autosuggest-focus`
 

## Functions

> @function strip-unit($number)
> 
> @function breakpoint-next($name)
>
> @function breakpoint-max($name)
# @mbolli/datastar-attribute-prop

[![npm version](https://img.shields.io/npm/v/@mbolli/datastar-attribute-prop.svg)](https://www.npmjs.com/package/@mbolli/datastar-attribute-prop)
[![Release](https://github.com/mbolli/datastar-attribute-prop/actions/workflows/release.yml/badge.svg)](https://github.com/mbolli/datastar-attribute-prop/actions/workflows/release.yml)
[![GitHub Pages](https://github.com/mbolli/datastar-attribute-prop/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/mbolli/datastar-attribute-prop/actions/workflows/gh-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A [Datastar](https://data-star.dev) plugin that provides property binding to sync element properties with reactive signals.

## About

[Datastar](https://data-star.dev) is a hypermedia-focused framework that brings reactive signals and declarative DOM manipulation to your HTML. It includes a built-in `data-attr` plugin for setting HTML attributes, but HTML attributes and DOM properties are not the same thing.

While `data-attr` works great for HTML attributes (like `class`, `id`, `href`), many DOM interactions require setting **properties** directly on elements instead. For example:
- Input `value` property (vs. the `value` attribute which only sets initial value)
- Checkbox `checked` property (vs. the `checked` attribute which only sets initial state)
- Element `disabled` property for real-time form control
- Custom properties on web components

This plugin fills that gap by providing a `data-prop` attribute that binds reactive signals directly to element properties, enabling true two-way reactivity with form inputs and other dynamic DOM elements.

## Installation

```bash
npm install @mbolli/datastar-attribute-prop
```

## Usage

### With npm and import maps

First, set up your import map in your HTML:

```html
<script type="importmap">
{
  "imports": {
    "datastar": "./node_modules/datastar/bundles/datastar.js",
    "@mbolli/datastar-attribute-prop": "./node_modules/@mbolli/datastar-attribute-prop/dist/index.js"
  }
}
</script>
```

Then register the plugin:

```javascript
import { attribute, effect } from 'datastar'
import propPlugin from '@mbolli/datastar-attribute-prop'

// Register the plugin
attribute(propPlugin(effect))
```

### CDN Usage (without npm)

You can also use the plugin directly from npm CDN:

```html
<script type="module">
  import { attribute, effect } from 'https://cdn.jsdelivr.net/gh/starfederation/datastar@v1.0.0-RC.6/bundles/datastar.js'
  import propPlugin from 'https://cdn.jsdelivr.net/npm/@mbolli/datastar-attribute-prop@1/dist/index.js'
  
  // Register the plugin
  attribute(propPlugin(effect))
</script>
```

Note: Using `@1` will automatically use the latest v1.x.x version.

## What it does

This plugin adds a `prop` attribute to Datastar that allows you to bind reactive signals directly to element properties (not HTML attributes).

### Single Property Binding

```html
<input data-prop:value="$mySignal" />
```

This binds the `value` property of the input element to the `mySignal` signal.

### Multiple Property Binding

```html
<input data-prop="{ value: $mySignal, disabled: $isDisabled }" />
```

This binds multiple properties at once using an object.

## How it works

- Uses `MutationObserver` to detect when properties are changed externally
- Automatically syncs property values with Datastar signals
- Properly cleans up observers on element removal
- Works with both single property and multiple property bindings

## Demo

**[View Interactive Demo →](https://mbolli.github.io/datastar-attribute-prop/)**

## Testing

Run the automated tests:

```bash
pnpm test
```

Or open `index.html` locally in a browser to interactively test the plugin with Datastar. The demo includes examples of:
- Single property binding (value, disabled, checked)
- Multiple property binding
- Different input types
- Dynamic updates

## Development & Releases

This project uses automated releases via GitHub Actions. When you push to `main`:

1. **Tests run automatically** - Build and tests must pass
2. **Version bumping** - Add to your commit message:
   - `[major]` for breaking changes (1.0.0 → 2.0.0)
   - `[minor]` for new features (1.0.0 → 1.1.0)
   - Default: patch for bug fixes (1.0.0 → 1.0.1)
3. **Automatic publishing** - Package is published to npm
4. **GitHub Release created** - With auto-generated release notes

## License

MIT

# eslint-plugin-sort

[![Build status](https://github.com/mskelton/eslint-plugin-sort/workflows/Build/badge.svg)](https://github.com/mskelton/eslint-plugin-sort/actions)
[![npm](https://img.shields.io/npm/v/eslint-plugin-sort)](https://www.npmjs.com/package/eslint-plugin-sort)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Auto-fixable sort rules for ESLint.

## Installation

### npm

```sh
npm install -D eslint-plugin-sort
```

### Yarn

```sh
yarn add -D eslint-plugin-sort
```

## Usage

After installing, add `sort` to your list of ESLint plugins and extend the
recommended configuration. This will enable all available rules as warnings.

```json
{
  "extends": "plugin:sort/recommended",
  "plugins": ["sort"]
}
```

## Rules

While the recommended configuration is the simplest way to use this plugin, you
can also configure the rules manually based on your needs.

### `sort/object-properties` 🔧

Sorts object properties alphabetically and case insensitive in ascending order.

Examples of **incorrect** code for this rule.

```js
var a = { b: 1, c: 2, a: 3 }
var a = { C: 1, b: 2 }
var a = { C: 1, b: { y: 1, x: 2 } }
```

Examples of **correct** code for this rule.

```js
var a = { a: 1, b: 2, c: 3 }
var a = { b: 1, C: 2 }
var a = { b: { x: 1, y: 2 }, C: 1 }
```

### `sort/destructuring-properties` 🔧

Sorts properties in object destructuring patterns alphabetically and case
insensitive in ascending order.

Examples of **incorrect** code for this rule.

```js
let { b, c, a } = {}
let { C, b } = {}
let { b: a, a: b } = {}
```

Examples of **correct** code for this rule.

```js
let { a, b, c } = {}
let { b, C } = {}
let { a: b, b: a } = {}
```

### `sort/import-members` 🔧

Sorts import members alphabetically and case insensitive in ascending order.

Examples of **incorrect** code for this rule.

```js
import { b, c, a } from "a"
import { C, b } from "a"
import { b as a, a as b } from "a"
```

Examples of **correct** code for this rule.

```js
import { a, b, c } from "a"
import { b, C } from "a"
import { a as b, b as a } from "a"
```

### `sort/imports` 🔧

Sorts imports alphabetically and case insensitive in ascending order.

Example of **incorrect** code for this rule.

```js
import c from "c"
import b from "b"
import a from "a"
```

Example of **correct** code for this rule.

```js
import a from "a"
import b from "b"
import c from "c"
```

#### Sort Groups

While the previous examples for this rule show very basic import sorting, this
rule has a very powerful mechanism for sorting imports into groups. This allows
you to separate common groups of imports to make it easier to scan your imports
at a glance.

There are three built-in sort groups you can use:

1. `side-effect`
   - Imports without any imported variables (e.g. `import 'index.css'`).
1. `dependency`
   - Imports which do not throw an error when calling `require.resolve`.
   - Useful for differentiating between path aliases (e.g. `components/Hello`)
     and dependencies (e.g. `react`)
1. `other`
   - Catch all sort group for any imports which did not match other sort groups.

You can also define custom regex sort groups if the built-in sort groups aren't
enough. The following configuration shows an example of using the built-in sort
groups as well as a custom regex sort group.

```json
{
  "sort/imports": [
    "warn",
    {
      "groups": [
        { "type": "side-effect", "order": 1 },
        { "regex": "\\.(png|jpg|svg)$", "order": 4 },
        { "type": "dependency", "order": 2 },
        { "type": "other", "order": 3 }
      ]
    }
  ]
}
```

This configuration would result in the following output.

```js
import "index.css"

import React from "react"
import { createStore } from "redux"

import c from "c"
import a from "../a"
import b from "./b"

import image1 from "my-library/static/image.svg"
import image2 from "static/image.jpg"
import image3 from "static/image.png"
```

##### Order

It's important to understand the difference between the order of the sort groups
in the `groups` array, and the `order` property of each sort group. When sorting
imports, this plugin will find the first sort group which the import would apply
to and then assign it an order using the `order` property. This allows you to
define a hierarchy of sort groups in descending specificity (e.g. side effect
then regex) while still having full control over the order of the sort groups in
the resulting code.

For example, the `other` sort group will match any import and thus should always
be last in the list of sort groups. However, if you want to sort static asset
imports (e.g. `.png` or `.jpg`) after the `other` sort group, you can use the
`order` property to give the static assets a higher order than the `other` sort
group.

The configuration example above shows how this works where the static asset
imports are the second sort group even though they have the highest order and
are thus the last sort group in the resulting code.

#### Custom Separator

If you are using sort groups, you have the option to provide a custom separator
between sort groups. For example, the following configuration would separate
groups by newlines.

```json
{
  "sort/imports": [
    "warn",
    {
      "groups": [
        // ...
      ],
      "separator": "\n"
    }
  ]
}
```

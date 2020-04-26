# eslint-plugin-sort

[![Build status](https://github.com/mskelton/eslint-plugin-sort/workflows/Build/badge.svg)](https://github.com/mskelton/eslint-plugin-sort/actions)
[![npm](https://img.shields.io/npm/v/eslint-plugin-sort)](https://www.npmjs.com/package/eslint-plugin-sort)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg)](#contributors)

> Autofixable sort rules for ESLint.

## Installation

```sh
# npm
npm install -D eslint-plugin-sort

# Yarn
yarn add -D eslint-plugin-sort
```

## Usage

After installing, add `sort` to your list of ESLint plugins and extend the recommended configuration. This will enable all available rules as warnings.

```json
{
  "extends": ["plugin:sort/recommended"],
  "plugins": ["sort"]
}
```

## Rules

While the recommended configuration is the simplest way to use this plugin, you can also configure the rules manually based on your needs.

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

### `sort/destructured-properties` 🔧

Sorts properties in object destructuring patterns alphabetically and case insensitive in ascending order.

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

### `sort/imported-variables` 🔧

Sorts imported variable names alphabetically and case insensitive in ascending order.

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/mskelton"><img src="https://avatars3.githubusercontent.com/u/25914066?v=4" width="100px;" alt="Mark Skelton"/><br /><sub><b>Mark Skelton</b></sub></a><br /><a href="https://github.com/mskelton/eslint-plugin-sort/commits?author=mskelton" title="Code">💻</a> <a href="https://github.com/mskelton/eslint-plugin-sort/commits?author=mskelton" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

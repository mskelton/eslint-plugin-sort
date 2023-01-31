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

### pnpm

```sh
pnpm add -D eslint-plugin-sort
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

## List of Supported Rules

✔: Enabled in the `recommended` configuration.\
🔧: Fixable with [`eslint --fix`](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems).

|  ✔  | 🔧  | Rule                                                                    | Description                           |
| :-: | :-: | ----------------------------------------------------------------------- | ------------------------------------- |
|  ✔  | 🔧  | [sort/destructuring-properties](docs/rules/destructuring-properties.md) | Sorts object destructuring properties |
|  ✔  | 🔧  | [sort/exports](docs/rules/exports.md)                                   | Sorts exports                         |
|  ✔  | 🔧  | [sort/export-members](docs/rules/export-members.md)                     | Sorts export members                  |
|  ✔  | 🔧  | [sort/imports](docs/rules/imports.md)                                   | Sorts imports                         |
|  ✔  | 🔧  | [sort/import-members](docs/rules/import-members.md)                     | Sorts import members                  |
|  ✔  | 🔧  | [sort/object-properties](docs/rules/object-properties.md)               | Sorts object properties               |
|     | 🔧  | [sort/type-properties](docs/rules/type-properties.md)                   | Sorts TypeScript type properties      |

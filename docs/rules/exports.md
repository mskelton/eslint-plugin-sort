# Export Sorting (sort/exports)

🔧 The `--fix` option on the command line can automatically fix the problems
reported by this rule.

Sorts exports alphabetically and case insensitive in ascending order.

## Rule Details

Example of **incorrect** code for this rule:

```javascript
export { c } from "./c"
export default React
export * from "./b"
export { mark }
export { a } from "./a"
```

Example of **correct** code for this rule:

```javascript
export { a } from "./a"
export * from "./b"
export { c } from "./c"
export { mark }
export default React
```

## Options

This rule has an options object with the following defaults.

```json
{
  "sort/exports": [
    "error",
    {
      "groups": [],
      "typeOrder": "preserve",
      "caseSensitive": false,
      "natural": true
    }
  ]
}
```

### Groups

By default, this rule will perform basic alphanumeric sorting but you can
greatly customize your export sorting with sort groups.This allows you to
separate common groups of exports to make it easier to scan your exports at a
glance.

There are four built-in sort groups you can use:

1. `default`
   - Default exports (e.g. `export default a`).
1. `sourceless`
   - Exports without a source (e.g. `export { a }`).
1. `dependency`
   - Exports which do not throw an error when calling `require.resolve` on the
     source.
   - Useful for differentiating between path aliases (e.g. `components/Hello`)
     and dependencies (e.g. `react`).
1. `type`
   - TypeScript type only imports (e.g. `export type { Foo } from 'foo'`)
1. `other`
   - Catch all sort group for any exports which did not match other sort groups.

You can also define custom regex sort groups if the built-in sort groups aren't
enough. The following configuration shows an example of using the built-in sort
groups as well as a custom regex sort group.

```json
{
  "sort/exports": [
    "warn",
    {
      "groups": [
        { "type": "default", "order": 50 },
        { "type": "sourceless", "order": 10 },
        { "regex": "^~", "order": 30 },
        { "type": "dependency", "order": 20 },
        { "type": "other", "order": 40 }
      ]
    }
  ]
}
```

This configuration would result in the following output.

```javascript
export { a }
export { useState } from "react"
export App from "~/components"
export { b } from "./b"
export default c
```

#### Group Order

It's important to understand the difference between the order of the sort groups
in the `groups` array, and the `order` property of each sort group. When sorting
exports, this plugin will find the first sort group which the export would apply
to and then assign it an order using the `order` property. This allows you to
define a hierarchy of sort groups in descending specificity (e.g. dependency
then regex) while still having full control over the order of the sort groups in
the resulting code.

For example, the `other` sort group will match any export and thus should always
be last in the list of sort groups. However, if you want to sort dependency
exports (e.g. `react`) after the `other` sort group, you can use the `order`
property to give the dependency exports a higher order than the `other` sort
group.

The configuration example above shows how this works where default exports are
the first sort group even though they have the highest order and are thus the
last sort group in the resulting code.

### `typeOrder`

When using `export type` in TypeScript files, type exports and regular exports
may be two separate export statements. By default, the order of these statements
is preserved, but you can customize this behavior.

Examples of **incorrect** code with `"typeOrder": "first"`:

```typescript
export { foo } from "a"
export type { Foo } from "a"
```

Examples of **correct** code with `"typeOrder": "first"`:

```typescript
export type { Foo } from "a"
export { foo } from "a"
```

Examples of **incorrect** code with `"typeOrder": "last"`:

```typescript
export type { Foo } from "a"
export { foo } from "a"
```

Examples of **correct** code with `"typeOrder": "last"`:

```typescript
export { foo } from "a"
export type { Foo } from "a"
```

_Note: This option only applies after other sorting logic. So if you separate
all type exports into their own section using the `"type"` sort group, this
option will not have any impact._

### `caseSensitive`

If `true`, enforce exports to be in case-sensitive order.

### `natural`

If `true`, enforce exports to be in natural order. Natural order compares
strings containing combination of letters and numbers in the way a human being
would sort. For example, `a-10` would come after `a-3` when using natural
ordering.

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing exports isn't a part of your
coding standards, then you can leave this rule off.

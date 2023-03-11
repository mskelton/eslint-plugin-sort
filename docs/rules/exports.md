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

## Rule Options

This rule has an object with its properties as:

- `"groups"` (default: `[]`)

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
        { "type": "default", "order": 5 },
        { "type": "sourceless", "order": 1 },
        { "regex": "^~", "order": 3 },
        { "type": "dependency", "order": 2 },
        { "type": "other", "order": 4 }
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

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing exports isn't a part of your
coding standards, then you can leave this rule off.

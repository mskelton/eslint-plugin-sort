# Export Member Sorting (sort/export-members)

🔧 The `--fix` option on the command line can automatically fix the problems
reported by this rule.

Sorts export members alphabetically and case insensitive in ascending order.

## Rule Details

Examples of **incorrect** code for this rule:

```js
export { b, c, a } from "a"
export { C, b } from "a"
export { b as a, a as b } from "a"
```

Examples of **correct** code for this rule:

```js
export { a, b, c } from "a"
export { b, C } from "a"
export { a as b, b as a } from "a"
```

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing export members isn't a part of
your coding standards, then you can leave this rule off.

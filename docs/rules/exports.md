# Export Sorting (sort/exports)

🔧 The `--fix` option on the command line can automatically fix the problems
reported by this rule.

Sorts exports alphabetically and case insensitive in ascending order.

## Rule Details

Example of **incorrect** code for this rule:

```js
export { c } from "./c"
export default React
export * from "./b"
export { mark }
export { a } from "./a"
```

Example of **correct** code for this rule:

```js
export { a } from "./a"
export * from "./b"
export { c } from "./c"
export { mark }
export default React
```

### Groups

Exports are sorted in the following groups top to bottom:

- Exports with a source
- Exports with no source
- Default export

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing exports isn't a part of your
coding standards, then you can leave this rule off.

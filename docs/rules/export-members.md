# Export Member Sorting (sort/export-members)

🔧 The `--fix` option on the command line can automatically fix the problems
reported by this rule.

Sorts export members alphabetically and case insensitive in ascending order.

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
export { b, c, a } from "a"
export { C, b } from "a"
export { b as a, a as b } from "a"
```

Examples of **correct** code for this rule:

```javascript
export { a, b, c } from "a"
export { b, C } from "a"
export { a as b, b as a } from "a"
```

## Options

```json
{
  "sort/export-members": ["error", { "caseSensitive": false, "natural": true }]
}
```

- `caseSensitive` (default `false`) - if `true`, enforce properties to be in
  case-sensitive order.
- `natural` (default `true`) - if `true`, enforce properties to be in natural
  order. Natural order compares strings containing combination of letters and
  numbers in the way a human being would sort. It basically sorts numerically,
  instead of sorting alphabetically. So the number 10 comes after the number 3
  in natural sorting.

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing export members isn't a part of
your coding standards, then you can leave this rule off.

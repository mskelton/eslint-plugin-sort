# Object Property Sorting (sort/object-properties)

🔧 The `--fix` option on the command line can automatically fix the problems
reported by this rule.

Sorts object properties alphabetically and case insensitive in ascending order.

## Rule Details

Examples of **incorrect** code for this rule:

```js
var a = { b: 1, c: 2, a: 3 }
var a = { C: 1, b: 2 }
var a = { C: 1, b: { y: 1, x: 2 } }
```

Examples of **correct** code for this rule:

```js
var a = { a: 1, b: 2, c: 3 }
var a = { b: 1, C: 2 }
var a = { b: { x: 1, y: 2 }, C: 1 }
```

## Options

```json
{
  "sort/object-properties": [
    "error",
    { "caseSensitive": false, "natural": true }
  ]
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
affect the quality of your code. If alphabetizing object properties isn't a part
of your coding standards, then you can leave this rule off.

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
  "sort-keys": ["error", "asc", { "caseSensitive": false, "natural": false }]
}
```

The 1st option is `"asc"` or `"desc"`.

- `"asc"` (default) - enforce properties to be in ascending order.
- `"desc"` - enforce properties to be in descending order.

The 2nd option is an object which has 2 properties.

- `caseSensitive` - if `true`, enforce properties to be in case-sensitive order.
  Default is `false`.
- `natural` - if `true`, enforce properties to be in natural order. Default is
  `false`. Natural Order compares strings containing combination of letters and
  numbers in the way a human being would sort. It basically sorts numerically,
  instead of sorting alphabetically. So the number 10 comes after the number 3
  in Natural Sorting.

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing object properties isn't a part
of your coding standards, then you can leave this rule off.

# Destructuring Properties Sorting (sort/destructuring-properties)

🔧 The `--fix` option on the command line can automatically fix the problems
reported by this rule.

Sorts properties in object destructuring patterns alphabetically and case
insensitive in ascending order.

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
let { b, c, a } = {}
let { C, b } = {}
let { b: a, a: b } = {}
```

Examples of **correct** code for this rule:

```javascript
let { a, b, c } = {}
let { b, C } = {}
let { a: b, b: a } = {}
```

## Options

This rule has an options object with the following defaults.

```json
{
  "sort/destructuring-properties": [
    "error",
    { "caseSensitive": false, "natural": true }
  ]
}
```

### `caseSensitive`

If `true`, enforce properties to be in case-sensitive order.

### `natural`

If `true`, enforce properties to be in natural order. Natural order compares
strings containing combination of letters and numbers in the way a human being
would sort. For example, `a-10` would come after `a-3` when using natural
ordering.

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing destructuring properties isn't
a part of your coding standards, then you can leave this rule off.

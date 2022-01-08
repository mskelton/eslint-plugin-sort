# Destructuring Properties Sorting (sort/destructuring-properties)

🔧 The `--fix` option on the command line can automatically fix the problems
reported by this rule.

Sorts properties in object destructuring patterns alphabetically and case
insensitive in ascending order.

## Rule Details

Examples of **incorrect** code for this rule:

```js
let { b, c, a } = {}
let { C, b } = {}
let { b: a, a: b } = {}
```

Examples of **correct** code for this rule:

```js
let { a, b, c } = {}
let { b, C } = {}
let { a: b, b: a } = {}
```

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing object properties isn't a part
of your coding standards, then you can leave this rule off.

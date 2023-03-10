# Import Member Sorting (sort/import-members)

🔧 The `--fix` option on the command line can automatically fix the problems
reported by this rule.

Sorts import members alphabetically and case insensitive in ascending order.

## Rule Details

Examples of **incorrect** code for this rule:

```js
import { b, c, a } from "a"
import { C, b } from "a"
import { b as a, a as b } from "a"
```

Examples of **correct** code for this rule:

```js
import { a, b, c } from "a"
import { b, C } from "a"
import { a as b, b as a } from "a"
```

## Options

```json
{
  "sort/import-members": ["error", { "caseSensitive": false, "natural": true }]
}
```

- `caseSensitive` - if `true`, enforce properties to be in case-sensitive order.
  Default is `false`.
- `natural` - if `true`, enforce properties to be in natural order. Default is
  `true`. Natural Order compares strings containing combination of letters and
  numbers in the way a human being would sort. It basically sorts numerically,
  instead of sorting alphabetically. So the number 10 comes after the number 3
  in Natural Sorting.

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing import members isn't a part of
your coding standards, then you can leave this rule off.

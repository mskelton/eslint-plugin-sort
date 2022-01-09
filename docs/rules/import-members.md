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

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing import members isn't a part of
your coding standards, then you can leave this rule off.

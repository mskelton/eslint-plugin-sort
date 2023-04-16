# Import Member Sorting (sort/import-members)

🔧 The `--fix` option on the command line can automatically fix the problems
reported by this rule.

Sorts import members alphabetically and case insensitive in ascending order.

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
import { b, c, a } from "a"
import { C, b } from "a"
import { b as a, a as b } from "a"
```

Examples of **correct** code for this rule:

```javascript
import { a, b, c } from "a"
import { b, C } from "a"
import { a as b, b as a } from "a"
```

## Options

This rule has an options object with the following defaults.

```json
{
  "sort/import-members": ["error", { "caseSensitive": false, "natural": true }]
}
```

### `caseSensitive`

If `true`, enforce import members to be in case-sensitive order.

### `natural`

If `true`, enforce import members to be in natural order. Natural order compares
strings containing combination of letters and numbers in the way a human being
would sort. For example, `a-10` would come after `a-3` when using natural
ordering.

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing import members isn't a part of
your coding standards, then you can leave this rule off.

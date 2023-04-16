# TypeScript String Union Sorting (sort/string-unions)

🔧 The `--fix` option on the command line can automatically fix the problems
reported by this rule.

Sorts TypeScript string unions alphabetically and case insensitive in ascending
order. This only applies to union types that are made up of entirely string
keys, so mixed type unions will be ignored.

## Rule Details

Examples of **incorrect** code for this rule:

```typescript
type Fruit = "orange" | "apple" | "grape"
```

Examples of **correct** code for this rule:

```typescript
type Fruit = "apple" | "grape" | "orange"
```

## Options

This rule has an options object with the following defaults.

```json
{
  "sort/string-unions": ["error", { "caseSensitive": false, "natural": true }]
}
```

### `caseSensitive`

If `true`, enforce string unions to be in case-sensitive order.

### `natural`

If `true`, enforce string unions to be in natural order. Natural order compares
strings containing combination of letters and numbers in the way a human being
would sort. For example, `a-10` would come after `a-3` when using natural
ordering.

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing string unions isn't a part of
your coding standards, then you can leave this rule off.

# TypeScript String Enum Sorting (sort/string-enums)

🔧 The `--fix` option on the command line can automatically fix the problems
reported by this rule.

Sorts TypeScript string enums alphabetically and case insensitive in ascending
order.

## Rule Details

Examples of **incorrect** code for this rule:

```typescript
enum Fruit {
  Orange = "orange",
  Apple = "apple",
  Grape = "grape",
}
```

Examples of **correct** code for this rule:

```typescript
enum Fruit {
  Apple = "apple",
  Grape = "grape",
  Orange = "orange",
}
```

## Options

This rule has an options object with the following defaults.

```json
{
  "sort/string-enums": ["error", { "caseSensitive": false, "natural": true }]
}
```

### `caseSensitive`

If `true`, enforce string enums to be in case-sensitive order.

### `natural`

If `true`, enforce string enums to be in natural order. Natural order compares
strings containing combination of letters and numbers in the way a human being
would sort. For example, `A10` would come after `A3` when using natural
ordering.

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing string enums isn't a part of
your coding standards, then you can leave this rule off.

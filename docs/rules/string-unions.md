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

```json
{
  "sort/string-unions": ["error", { "caseSensitive": false, "natural": true }]
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
affect the quality of your code. If alphabetizing string unions isn't a part of
your coding standards, then you can leave this rule off.

# TypeScript Type Property Sorting (sort/type-properties)

🔧 The `--fix` option on the command line can automatically fix the problems
reported by this rule.

Sorts TypeScript type properties alphabetically and case insensitive in
ascending order.

## Rule Details

Examples of **incorrect** code for this rule:

```typescript
interface A {
  B: number
  c: string
  a: boolean
}

type A = {
  b: number
  a: {
    y: string
    x: boolean
  }
}
```

Examples of **correct** code for this rule:

```typescript
interface A {
  a: boolean
  B: number
  c: string
}

type A = {
  a: {
    x: boolean
    y: string
  }
  b: number
}
```

## Options

This rule has an options object with the following defaults.

```json
{
  "sort/type-properties": ["error", { "caseSensitive": false, "natural": true }]
}
```

### `caseSensitive`

If `true`, enforce exports to be in case-sensitive order.

### `natural`

If `true`, enforce imports to be in natural order. Natural order compares
strings containing combination of letters and numbers in the way a human being
would sort. For example, `a-10` would come after `a-3` when using natural
ordering.

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing type properties isn't a part
of your coding standards, then you can leave this rule off.

# TypeScript Type Property Sorting (sort/type-properties)

🔧 The `--fix` option on the command line can automatically fix the problems
reported by this rule.

Sorts TypeScript type properties alphabetically and case insensitive in
ascending order.

## Rule Details

Examples of **incorrect** code for this rule:

```ts
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

```ts
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

```json
{
  "sort/type-properties": ["error", { "caseSensitive": false, "natural": true }]
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
affect the quality of your code. If alphabetizing type properties isn't a part
of your coding standards, then you can leave this rule off.

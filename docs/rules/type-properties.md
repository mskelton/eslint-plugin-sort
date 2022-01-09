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

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing type properties isn't a part
of your coding standards, then you can leave this rule off.

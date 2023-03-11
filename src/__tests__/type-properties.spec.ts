import { ESLintUtils, TSESLint } from "@typescript-eslint/experimental-utils"
import rule from "../rules/type-properties.js"

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
})

const createValidCodeVariants = (
  code: string
): TSESLint.RunTests<
  "unsorted",
  [{ caseSensitive?: boolean; natural?: boolean }]
>["valid"] => {
  return [
    { code, options: [{ caseSensitive: false, natural: false }] },
    { code, options: [{ caseSensitive: true, natural: false }] },
    { code, options: [{ caseSensitive: false, natural: true }] },
    { code, options: [{ caseSensitive: true, natural: true }] },
  ]
}

ruleTester.run("sort/type-properties", rule, {
  valid: [
    // Interfaces
    ...createValidCodeVariants("interface A {}"),
    ...createValidCodeVariants("interface A { a: string }"),
    ...createValidCodeVariants("interface A { a: string, b: number }"),
    ...createValidCodeVariants(
      "interface A { _: string, a: string, b: string }"
    ),

    // Types
    ...createValidCodeVariants("type A = {}"),
    ...createValidCodeVariants("type A = { a: string }"),
    ...createValidCodeVariants("type A = { a: string, b: number }"),
    ...createValidCodeVariants("type A = { _:string, a: string, b: string }"),

    // Comments
    ...createValidCodeVariants(
      `
        interface A {
          // a
          a: string
          // b
          b: number
        }
      `.trim()
    ),

    // Weights
    ...createValidCodeVariants(`
      interface A {
        new(f: string): void
        (e: string): void
        b: boolean
        c: boolean
        d(): void
        [a: string]: unknown
      }
    `),

    // Numeric keys
    {
      code: "type A = { 1: 'a', 11: 'b', 2: 'c' }",
      options: [{ caseSensitive: false, natural: false }],
    },
    {
      code: "type A = { 1: 'a',  11: 'b', 2: 'c' }",
      options: [{ caseSensitive: true, natural: false }],
    },
    {
      code: "type A = { 1: 'a', 2: 'c', 11: 'b' }",
      options: [{ caseSensitive: false, natural: true }],
    },
    {
      code: "type A = { 1: 'a', 2: 'c', 11: 'b' }",
      options: [{ caseSensitive: true, natural: true }],
    },

    // Case sensitive
    {
      code: "type A = { a: 1, B: 2, c: 3, C: 4 }",
      options: [{ caseSensitive: false, natural: false }],
    },
    {
      code: "type A = { a: 1, B: 2, c: 3, C: 4 }",
      options: [{ caseSensitive: true, natural: false }],
    },
    {
      code: "type A = { a: 1, B: 2, c: 3, C: 4 }",
      options: [{ caseSensitive: false, natural: true }],
    },
    {
      code: "type A = { B: 2, C: 4, a: 1, c: 3 }",
      options: [{ caseSensitive: true, natural: true }],
    },
  ],
  invalid: [
    {
      code: "interface A {c:string, a:number, b:boolean}",
      output: "interface A {a:number, b:boolean, c:string}",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "interface A {b:boolean, a:string, _:number}",
      output: "interface A {_:number, a:string, b:boolean}",
      errors: [{ messageId: "unsorted" }],
    },

    // Case insensitive
    {
      code: "type A = {b: symbol; A: number; _: string}",
      output: "type A = {_: string; A: number; b: symbol}",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "type A = {D:number, a:boolean, c:string, B:string}",
      output: "type A = {a:boolean, B:string, c:string, D:number}",
      errors: [{ messageId: "unsorted" }],
    },

    // All properties are sorted with a single sort
    {
      code: "interface A {z:string,y:number,x:boolean,w:symbol,v:string}",
      output: "interface A {v:string,w:symbol,x:boolean,y:number,z:string}",
      errors: [{ messageId: "unsorted" }],
    },

    // Nested
    {
      code: "interface A {b:string; a:{b:string; a:number}}",
      output: "interface A {a:{b:string; a:number}; b:string}",
      // Rule tester will not run multiple fix iterations, but as long as we
      // have two errors, we know the nested rule was caught.
      errors: [{ messageId: "unsorted" }, { messageId: "unsorted" }],
    },

    // Weights
    {
      code: `
        interface A {
          b: boolean
          (e: string): void
          [a: string]: unknown
          [b: string]: boolean
          d(): void
          c: boolean
          [\`c\${o}g\`]: boolean
          new(f: string): void
        }
      `,
      output: `
        interface A {
          new(f: string): void
          (e: string): void
          b: boolean
          c: boolean
          [\`c\${o}g\`]: boolean
          d(): void
          [a: string]: unknown
          [b: string]: boolean
        }
      `,
      errors: [{ messageId: "unsorted" }],
    },

    // Comments
    {
      code: `
        interface A {
          // c
          c: boolean
          // b
          b: number
          a: string
        }
      `.trim(),
      output: `
        interface A {
          a: string
          // b
          b: number
          // c
          c: boolean
        }
      `.trim(),
      errors: [{ messageId: "unsorted" }],
    },
  ],
})

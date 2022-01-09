import { ESLintUtils } from "@typescript-eslint/experimental-utils"
import rule from "../rules/type-properties"

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
})

ruleTester.run("sort/type-properties", rule, {
  valid: [
    "interface A {a: string, b: number}",
    "interface A {a: string}",
    "interface A {}",
    "type A = {_:string, a:string, b:string}",

    // Case insensitive
    "type A = {a:string, B:string, c:string, D:string}",
    "type A = {_:string, A:string, b:string}",

    // Weights
    `
      interface A {
        new(f: string): void
        (e: string): void
        b: boolean
        c: boolean
        d(): void
        [a: string]: unknown
      }
    `,

    // Comments
    `
      interface A {
        // a
        a: string
        // b
        b: number
      }
    `.trim(),
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

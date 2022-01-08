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
      code: "type A = {b, A, _:string}",
      output: "type A = {_, A, b:string}",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "type A = {D, a, c, B:string}",
      output: "type A = {a, B, c, D:string}",
      errors: [{ messageId: "unsorted" }],
    },

    // All properties are sorted with a single sort
    {
      code: "interface A {z:string,y:number,x:boolean,w:symbol,v:string}",
      output: "interface A {v:string,w:symbol,x:string,y:number,z:string}",
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
        type A = {
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

import { RuleTester } from "eslint"
import rule from "../rules/destructuring-properties"
import { heredoc } from "./utils"

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
  },
})

ruleTester.run("sort/destructured-properties", rule, {
  valid: [
    // Basic
    "let {} = {}",
    "let {a} = {}",
    "let {a, b, c} = {}",
    "let {_, a, b} = {}",
    "let {p,q,r,s,t,u,v,w,x,y,z} = {}",

    // Case insensitive
    "let {a, B, c, D} = {}",
    "let {_, A, b} = {}",

    // Aliases
    "let {a: b, b: a} = {}",

    // Rest element
    "let {a, b, ...c} = {}",
    "let {...rest} = {}",

    // Comments
    heredoc(`
      let {
        // a
        a,
        // b
        b,
        // rest
        ...rest
      } = {}
    `),
  ],
  invalid: [
    // Basic
    {
      code: "let {c, a, b} = {}",
      output: "let {a, b, c} = {}",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "let {b, a, _} = {}",
      output: "let {_, a, b} = {}",
      errors: [{ messageId: "unsorted" }],
    },

    // Case insensitive
    {
      code: "let {b, A, _} = {}",
      output: "let {_, A, b} = {}",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "let {D, a, c, B} = {}",
      output: "let {a, B, c, D} = {}",
      errors: [{ messageId: "unsorted" }],
    },

    // Aliases
    {
      code: "let {b: a, a: b} = {}",
      output: "let {a: b, b: a} = {}",
      errors: [{ messageId: "unsorted" }],
    },

    // Rest element
    {
      code: "let {c, a, b, ...rest} = {}",
      output: "let {a, b, c, ...rest} = {}",
      errors: [{ messageId: "unsorted" }],
    },

    // All properties are sorted with a single sort
    {
      code: "let {z,y,x,w,v,u,t,s,r,q,p} = {}",
      output: "let {p,q,r,s,t,u,v,w,x,y,z} = {}",
      errors: [{ messageId: "unsorted" }],
    },

    // Comments
    {
      code: heredoc(`
      let {
        // c
        c,
        // b
        b,
        a,
        // rest
        ...rest
      } = {}
      `),
      output: heredoc(`
      let {
        a,
        // b
        b,
        // c
        c,
        // rest
        ...rest
      } = {}
      `),
      errors: [{ messageId: "unsorted" }],
    },
  ],
})
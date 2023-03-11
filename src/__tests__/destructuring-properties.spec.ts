import { RuleTester } from "eslint"
import rule from "../rules/destructuring-properties"
import { createValidCodeVariants } from "../test-utils"

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
  },
})

ruleTester.run("sort/destructuring-properties", rule, {
  valid: [
    ...createValidCodeVariants("let {} = {}"),
    ...createValidCodeVariants("let { a } = {}"),
    ...createValidCodeVariants("let { a, b, c } = {}"),
    ...createValidCodeVariants("let { _, a, b } = {}"),
    ...createValidCodeVariants("let { p, q, r, s, t, u, v, w, x, y, z } = {}"),

    // Aliases
    ...createValidCodeVariants("let { a: b, b: a } = {}"),

    // Rest element
    ...createValidCodeVariants("let { a, b, ...c } = {}"),
    ...createValidCodeVariants("let { ...rest } = {}"),

    // Comments
    ...createValidCodeVariants(
      `
        let {
          // a
          a,
          // b
          b,
          // rest
          ...rest
        } = {}
      `.trim()
    ),

    // Numeric properties
    {
      code: "let { 1: a, 11: b, 2: c } = {}",
      options: [{ caseSensitive: false, natural: false }],
    },
    {
      code: "let { 1: a, 11: b, 2: c } = {}",
      options: [{ caseSensitive: true, natural: false }],
    },
    {
      code: "let { 1: a, 2: c, 11: b } = {}",
      options: [{ caseSensitive: false, natural: true }],
    },
    {
      code: "let { 1: a, 2: c, 11: b } = {}",
      options: [{ caseSensitive: true, natural: true }],
    },

    // Case sensitive
    {
      code: "let { a: A, B: b, C: c, c: C } = {}",
      options: [{ caseSensitive: false, natural: false }],
    },
    {
      code: "let { a: A, B: b, c: C, C: c } = {}",
      options: [{ caseSensitive: true, natural: false }],
    },
    {
      code: "let { a: A, B: b, c: C, C: c } = {}",
      options: [{ caseSensitive: false, natural: true }],
    },
    {
      code: "let { B: b, C: c, a: A, c: C } = {}",
      options: [{ caseSensitive: true, natural: true }],
    },
  ],
  invalid: [
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
      code: `
        let {
          // c
          c,
          // b
          b,
          a,
          // rest
          ...rest
        } = {}
      `.trim(),
      output: `
        let {
          a,
          // b
          b,
          // c
          c,
          // rest
          ...rest
        } = {}
      `.trim(),
      errors: [{ messageId: "unsorted" }],
    },
  ],
})

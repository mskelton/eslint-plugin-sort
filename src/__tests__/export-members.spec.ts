import { RuleTester } from "eslint"
import rule from "../rules/export-members"

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
})

ruleTester.run("sort/export-members", rule, {
  valid: [
    "export {} from 'a'",
    "export {a} from 'a'",
    "export {a, b, c} from 'a'",
    "export {_, a, b} from 'a'",
    "export {p,q,r,s,t,u,v,w,x,y,z} from 'a'",

    // Case insensitive
    "export {a, B, c, D} from 'a'",
    "export {_, A, b} from 'a'",

    // Default and namespace exports
    "export default React",
    "export * from 'a'",

    // Export aliases
    "export {a as b, b as a} from 'a'",

    // Comments
    `
      export {
        // a
        a,
        // b
        b,
        // c
        c
      } from 'a'
    `.trim(),
  ],
  invalid: [
    {
      code: "export {c, a, b} from 'a'",
      output: "export {a, b, c} from 'a'",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "export {b, a, _} from 'a'",
      output: "export {_, a, b} from 'a'",
      errors: [{ messageId: "unsorted" }],
    },

    // Case insensitive
    {
      code: "export {b, A, _} from 'a'",
      output: "export {_, A, b} from 'a'",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "export {D, a, c, B} from 'a'",
      output: "export {a, B, c, D} from 'a'",
      errors: [{ messageId: "unsorted" }],
    },

    // Export aliases
    {
      code: "export {b as a, a as b} from 'a'",
      output: "export {a as b, b as a} from 'a'",
      errors: [{ messageId: "unsorted" }],
    },

    // All properties are sorted with a single sort
    {
      code: "export {z,y,x,w,v,u,t,s,r,q,p} from 'a'",
      output: "export {p,q,r,s,t,u,v,w,x,y,z} from 'a'",
      errors: [{ messageId: "unsorted" }],
    },

    // Comments
    {
      code: `
        export {
          // c
          c,
          // b
          b,
          // a
          a
        } from 'a'
      `.trim(),
      output: `
        export {
          // a
          a,
          // b
          b,
          // c
          c
        } from 'a'
      `.trim(),
      errors: [{ messageId: "unsorted" }],
    },
  ],
})
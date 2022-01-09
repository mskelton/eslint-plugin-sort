import { RuleTester } from "eslint"
import rule from "../rules/exports"

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
})

ruleTester.run("sort/exports", rule, {
  valid: [
    "export { a } from './a'",
    `
      export { a } from './a'
      export { b } from './b'
    `.trim(),
    `
      export { a } from './a'
      export * from './b'
      export { c } from './c'
    `.trim(),

    // Programs without exports are valid
    "var a = 1",

    // Comments
    `
      // a
      export { a } from "./a"
      // b
      export { b } from "./b"
      // c
      export { c } from "./c"
    `.trim(),
  ],
  invalid: [
    {
      code: `
        export { b } from 'b'
        export { a } from 'a'
      `,
      output: `
        export { a } from 'a'
        export { b } from 'b'
      `,
      errors: [{ messageId: "unsorted" }],
    },

    // All types of exports
    {
      code: `
        export { c } from 'c'
        export default React
        export * from 'b'
        export { mark }
        export { a } from 'a'
      `,
      output: `
        export { a } from 'a'
        export * from 'b'
        export { c } from 'c'
        export { mark }
        export default React
      `,
      errors: [{ messageId: "unsorted" }],
    },

    // Comments
    {
      code: `
        // c
        export { c } from "c"
        // b
        export { b } from "b"
        // a
        export { a } from "a"
      `.trim(),
      output: `
        // a
        export { a } from "a"
        // b
        export { b } from "b"
        // c
        export { c } from "c"
      `.trim(),
      errors: [{ messageId: "unsorted" }],
    },
  ],
})

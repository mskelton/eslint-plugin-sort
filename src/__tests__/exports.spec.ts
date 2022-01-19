jest.mock("../resolver")

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

    // Sort groups
    {
      code: `
        const mark = ''

        export default React
        export { relA } from './a'
        export { relB } from './b'
        export { depA } from 'dependency-a'
        export { depB } from 'dependency-b'
        export * from 'a'
        export { b } from 'b'
        export { mark }
      `.trim(),
      options: [
        {
          groups: [
            { type: "default", order: 1 },
            { type: "sourceless", order: 5 },
            { regex: "^\\.+\\/", order: 2 },
            { type: "dependency", order: 3 },
            { type: "other", order: 4 },
          ],
        },
      ],
    },
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
        const mark = ''

        export { c } from 'c'
        export default React
        export * from 'b'
        export { mark }
        export { a } from 'a'
      `,
      output: `
        const mark = ''

        export default React
        export { mark }
        export { a } from 'a'
        export * from 'b'
        export { c } from 'c'
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

    // Sort groups
    {
      code: `
        const mark = ''

        export { depB } from 'dependency-b'
        export { mark }
        export default React
        export { relB } from './b'
        export * from 'a'
        export { relA } from './a'
        export { depA } from 'dependency-a'
        export { b } from 'b'
      `.trim(),
      output: `
        const mark = ''

        export { relA } from './a'
        export { relB } from './b'
        export * from 'a'
        export { b } from 'b'
        export { depA } from 'dependency-a'
        export { depB } from 'dependency-b'
        export { mark }
        export default React
    `.trim(),
      options: [
        {
          groups: [
            { type: "default", order: 3 },
            { type: "sourceless", order: 2 },
            { type: "other", order: 1 },
          ],
        },
      ],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: `
        const mark = ''

        export { depB } from 'dependency-b'
        export { mark }
        export default React
        export { relB } from './b'
        export * from 'a'
        export { relA } from './a'
        export { depA } from 'dependency-a'
        export { b } from 'b'
      `.trim(),
      output: `
        const mark = ''

        export default React
        export { relA } from './a'
        export { relB } from './b'
        export { depA } from 'dependency-a'
        export { depB } from 'dependency-b'
        export * from 'a'
        export { b } from 'b'
        export { mark }
    `.trim(),
      options: [
        {
          groups: [
            { type: "default", order: 1 },
            { type: "sourceless", order: 5 },
            { regex: "^\\.+\\/", order: 2 },
            { type: "dependency", order: 3 },
            { type: "other", order: 4 },
          ],
        },
      ],
      errors: [{ messageId: "unsorted" }],
    },
  ],
})

import { createRequire } from "node:module"
import dedent from "dedent"
import { createRuleTester } from "../test-utils.js"

const { default: rule } = await import("../rules/exports.js")

createRuleTester().run("sort/exports", rule, {
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

    // Case sensitivity and natural sort
    {
      code: dedent`
        export { a1 } from 'a1'
        export { a12 } from 'a12'
        export { a2 } from 'a2'
        export { b } from 'b'
        export { C } from 'C'
      `,
      options: [{ caseSensitive: false, natural: false }],
    },
    {
      code: dedent`
        export { C } from 'C'
        export { a1 } from 'a1'
        export { a12 } from 'a12'
        export { a2 } from 'a2'
        export { b } from 'b'
      `,
      options: [{ caseSensitive: true, natural: false }],
    },
    {
      code: dedent`
        export { a1 } from 'a1'
        export { a2 } from 'a2'
        export { a12 } from 'a12'
        export { b } from 'b'
        export { C } from 'C'
      `,
      options: [{ caseSensitive: false, natural: true }],
    },
    {
      code: dedent`
        export { C } from 'C'
        export { a1 } from 'a1'
        export { a2 } from 'a2'
        export { a12 } from 'a12'
        export { b } from 'b'
      `,
      options: [{ caseSensitive: true, natural: true }],
    },

    // Sort groups
    {
      code: dedent`
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
            { type: "default", order: 10 },
            { type: "sourceless", order: 50 },
            { regex: "^\\.+\\/", order: 20 },
            { type: "dependency", order: 30 },
            { type: "other", order: 40 },
          ],
        },
      ],
    },
  ],
  invalid: [
    {
      code: dedent`
        export { b } from 'b'
        export { a } from 'a'
      `,
      output: dedent`
        export { a } from 'a'
        export { b } from 'b'
      `,
      errors: [{ messageId: "unsorted" }],
    },

    // All types of exports
    {
      code: dedent`
        const mark = ''

        export { c } from 'c'
        export default React
        export * from 'b'
        export { mark }
        export { a } from 'a'
      `,
      output: dedent`
        const mark = ''

        export default React
        export { mark }
        export { a } from 'a'
        export * from 'b'
        export { c } from 'c'
      `,
      errors: [{ messageId: "unsorted" }],
    },

    // Case sensitivity and natural sort
    {
      code: dedent`
        export { a2 } from 'a2'
        export { C } from 'C'
        export { a1 } from 'a1'
        export { b } from 'b'
        export { a12 } from 'a12'
      `,
      output: dedent`
        export { a1 } from 'a1'
        export { a12 } from 'a12'
        export { a2 } from 'a2'
        export { b } from 'b'
        export { C } from 'C'
      `,
      options: [{ caseSensitive: false, natural: false }],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: dedent`
        export { a2 } from 'a2'
        export { b } from 'b'
        export { a1 } from 'a1'
        export { a12 } from 'a12'
        export { C } from 'C'
      `,
      output: dedent`
        export { C } from 'C'
        export { a1 } from 'a1'
        export { a12 } from 'a12'
        export { a2 } from 'a2'
        export { b } from 'b'
      `,
      options: [{ caseSensitive: true, natural: false }],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: dedent`
        export { a12 } from 'a12'
        export { C } from 'C'
        export { b } from 'b'
        export { a2 } from 'a2'
        export { a1 } from 'a1'
      `,
      output: dedent`
        export { a1 } from 'a1'
        export { a2 } from 'a2'
        export { a12 } from 'a12'
        export { b } from 'b'
        export { C } from 'C'
      `,
      options: [{ caseSensitive: false, natural: true }],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: dedent`
        export { a2 } from 'a2'
        export { b } from 'b'
        export { a1 } from 'a1'
        export { C } from 'C'
        export { a12 } from 'a12'
      `,
      output: dedent`
        export { C } from 'C'
        export { a1 } from 'a1'
        export { a2 } from 'a2'
        export { a12 } from 'a12'
        export { b } from 'b'
      `,
      options: [{ caseSensitive: true, natural: true }],
      errors: [{ messageId: "unsorted" }],
    },

    // Comments
    {
      code: dedent`
        // c
        export { c } from "c"
        // b
        export { b } from "b"
        // a
        export { a } from "a"
      `.trim(),
      output: dedent`
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
      code: dedent`
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
      output: dedent`
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
            { type: "default", order: 30 },
            { type: "sourceless", order: 20 },
            { type: "other", order: 10 },
          ],
        },
      ],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: dedent`
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
      output: dedent`
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
            { type: "default", order: 10 },
            { type: "sourceless", order: 50 },
            { regex: "^\\.+\\/", order: 20 },
            { type: "dependency", order: 30 },
            { type: "other", order: 40 },
          ],
        },
      ],
      errors: [{ messageId: "unsorted" }],
    },
  ],
})

// TypeScript rules
createRuleTester({
  parser: createRequire(import.meta.url).resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
}).run("sort/exports", rule, {
  valid: [
    // typeOrder
    {
      name: "typeOrder: keep",
      code: dedent`
        export { a } from 'a'
        export type { a } from 'a'
        export type { b } from 'b'
        export { b } from 'b'
      `,
    },
    {
      name: "typeOrder: last",
      code: dedent`
        export { a } from 'a'
        export type { a } from 'a'
        export { b } from 'b'
        export type { b } from 'b'
      `,
      options: [{ typeOrder: "last" }],
    },
    {
      name: "typeOrder: first",
      code: dedent`
        export type { a } from 'a'
        export { a } from 'a'
        export type { b } from 'b'
        export { b } from 'b'
      `,
    },

    // Sort groups
    {
      code: dedent`
        const mark = ''

        export default React
        export { relA } from './a'
        export { relB } from './b'
        export { depA } from 'dependency-a'
        export { depB } from 'dependency-b'
        export type { A } from 'dependency-a'
        export * from 'a'
        export { b } from 'b'
        export { mark }
      `.trim(),
      options: [
        {
          groups: [
            { type: "default", order: 10 },
            { type: "sourceless", order: 60 },
            { type: "type", order: 40 },
            { regex: "^\\.+\\/", order: 20 },
            { type: "dependency", order: 30 },
            { type: "other", order: 50 },
          ],
        },
      ],
    },
  ],
  invalid: [
    // typeOrder
    {
      name: "typeOrder: keep",
      code: dedent`
        export type { b } from 'b'
        export { b } from 'b'
        export { a } from 'a'
        export type { a } from 'a'
      `,
      output: dedent`
        export { a } from 'a'
        export type { a } from 'a'
        export type { b } from 'b'
        export { b } from 'b'
      `,
      errors: [{ messageId: "unsorted" }],
    },
    {
      name: "typeOrder: last",
      code: dedent`
        export type { a } from 'a'
        export { a } from 'a'
        export type { b } from 'b'
        export { b } from 'b'
      `,
      output: dedent`
        export { a } from 'a'
        export type { a } from 'a'
        export { b } from 'b'
        export type { b } from 'b'
      `,
      options: [{ typeOrder: "last" }],
      errors: [{ messageId: "unsorted" }],
    },
    {
      name: "typeOrder: first",
      code: dedent`
        export { a } from 'a'
        export type { a } from 'a'
        export { b } from 'b'
        export type { b } from 'b'
      `,
      output: dedent`
        export type { a } from 'a'
        export { a } from 'a'
        export type { b } from 'b'
        export { b } from 'b'
      `,
      options: [{ typeOrder: "first" }],
      errors: [{ messageId: "unsorted" }],
    },

    // Sort groups
    {
      code: dedent`
        const mark = ''

        export type { A } from 'dependency-a'
        export { depB } from 'dependency-b'
        export { mark }
        export default React
        export { relB } from './b'
        export * from 'a'
        export { relA } from './a'
        export { depA } from 'dependency-a'
        export { b } from 'b'
      `.trim(),
      output: dedent`
        const mark = ''

        export * from 'a'
        export { b } from 'b'
        export { depA } from 'dependency-a'
        export { depB } from 'dependency-b'
        export { relA } from './a'
        export { relB } from './b'
        export type { A } from 'dependency-a'
        export { mark }
        export default React
    `.trim(),
      options: [
        {
          groups: [
            { type: "default", order: 60 },
            { type: "sourceless", order: 50 },
            { type: "type", order: 40 },
            { regex: "^\\.+\\/", order: 30 },
            { type: "dependency", order: 20 },
            { type: "other", order: 10 },
          ],
        },
      ],
      errors: [{ messageId: "unsorted" }],
    },
  ],
})

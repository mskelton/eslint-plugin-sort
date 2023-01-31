import { jest } from "@jest/globals"
import { RuleTester } from "eslint"

jest.unstable_mockModule("../resolver", () => ({
  isResolved: (source: string) => source.startsWith("dependency-"),
}))

const { default: rule } = await import("../rules/imports.js")
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
})

ruleTester.run("sort/imports", rule, {
  valid: [
    "import a from 'a'",
    `
      import a from 'a'
      import b from 'b'
    `.trim(),
    `
      import a from 'a'
      import b from 'b'
      import c from 'c'
    `.trim(),

    // Programs without imports are valid
    "var a = 1",

    // Comments
    `
      // Start comment isn't moved
      import a from "a"
      // b
      import b from "b"
      // c
      import c from "c"
    `.trim(),

    // Sort groups
    {
      code: `
        import 'index.css'
        import 'side-effect'
        import a from "dependency-b"
        import b from "dependency-c"
        import c from "a.png"
        import d from "b.jpg"
        import e from "a"
        import f from "b"
        import g from "c"
        import h from "../b"
        import i from "./b"
      `.trim(),
      options: [
        {
          groups: [
            { type: "side-effect", order: 1 },
            { regex: "\\.(png|jpg)$", order: 3 },
            { regex: "^\\.+\\/", order: 5 },
            { type: "dependency", order: 2 },
            { type: "other", order: 4 },
          ],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `
        import b from 'b'
        import a from 'a'
      `,
      output: `
        import a from 'a'
        import b from 'b'
      `,
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: `
        import c from 'c'
        import b from 'b'
        import a from 'a'
      `,
      output: `
        import a from 'a'
        import b from 'b'
        import c from 'c'
      `,
      errors: [{ messageId: "unsorted" }],
    },

    // Comments
    {
      code: `
        // Start comment isn't moved
        import c from "c"
        // b
        import b from "b"
        // a
        import a from "a"
      `.trim(),
      output: `
        // Start comment isn't moved
        // a
        import a from "a"
        // b
        import b from "b"
        import c from "c"
      `.trim(),
      errors: [{ messageId: "unsorted" }],
    },

    // Sort groups
    {
      code: `
        import c from "a.png"
        import h from "../b"
        import b from "dependency-c"
        import d from "b.jpg"
        import a from "dependency-b"
        import i from "./b"
      `.trim(),
      output: `
        import a from "dependency-b"
        import b from "dependency-c"
        import c from "a.png"
        import d from "b.jpg"
        import h from "../b"
        import i from "./b"
      `.trim(),
      errors: [{ messageId: "unsorted" }],
      options: [
        {
          groups: [
            { type: "side-effect", order: 1 },
            { regex: "\\.(png|jpg)$", order: 3 },
            { regex: "^\\.+\\/", order: 5 },
            { type: "dependency", order: 2 },
            { type: "other", order: 4 },
          ],
        },
      ],
    },
    {
      code: `
        import b from "dependency-c"
        import h from "../b"
        import g from "c"
        import i from "./b"
        import f from "b"
        import c from "a.png"
        import 'side-effect'
        import 'index.css'
        import d from "b.jpg"
        import a from "dependency-b"
        import e from "a"
      `.trim(),
      output: `
        import 'index.css'
        import 'side-effect'
        import a from "dependency-b"
        import b from "dependency-c"
        import c from "a.png"
        import d from "b.jpg"
        import e from "a"
        import f from "b"
        import g from "c"
        import h from "../b"
        import i from "./b"
      `.trim(),
      errors: [{ messageId: "unsorted" }],
      options: [
        {
          groups: [
            { type: "side-effect", order: 1 },
            { regex: "\\.(png|jpg)$", order: 3 },
            { regex: "^\\.+\\/", order: 5 },
            { type: "dependency", order: 2 },
            { type: "other", order: 4 },
          ],
        },
      ],
    },
    {
      code: `
        import b from "dependency-c"
        import h from "../b"
        import g from "c"
        import i from "./b"
        import f from "b"
        import c from "a.png"
        import 'side-effect'
        import 'index.css'
        import d from "b.jpg"
        import a from "dependency-b"
        import e from "a"
      `.trim(),
      output: `
        import a from "dependency-b"
        import b from "dependency-c"
        import h from "../b"
        import i from "./b"
        import e from "a"
        import f from "b"
        import g from "c"
        import c from "a.png"
        import d from "b.jpg"
        import 'index.css'
        import 'side-effect'
      `.trim(),
      errors: [{ messageId: "unsorted" }],
      options: [
        {
          groups: [
            { type: "side-effect", order: 4 },
            { regex: "\\.(png|jpg)$", order: 3 },
            { type: "dependency", order: 1 },
            { type: "other", order: 2 },
          ],
        },
      ],
    },
  ],
})

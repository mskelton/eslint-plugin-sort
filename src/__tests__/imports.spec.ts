import { vi } from "vitest"
import dedent from "dedent"
import { createRuleTester } from "../test-utils.js"

vi.mock("isomorphic-resolve")

const { default: rule } = await import("../rules/imports.js")
const ruleTester = createRuleTester()

ruleTester.run("sort/imports", rule, {
  valid: [
    {
      name: "Programs without imports",
      code: "var a = 1",
    },
    {
      name: "Single import",
      code: "import a from 'a'",
    },
    {
      name: "Multiple imports",
      code: dedent`
        import a from 'a'
        import b from 'b'
        import c from 'c'
      `,
    },

    // Comments
    {
      name: "Comments",
      code: dedent`
        // Start comment isn't moved
        import a from "a"
        // b
        import b from "b"
        // c
        import c from "c"
      `,
    },

    // Sort groups
    {
      name: "Sort groups",
      code: dedent`
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
      `,
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

    // Separator
    {
      name: "Ignores non-newline whitespace",
      code: dedent`
        import a from "a"
          import c from "a.png"
         import b from "b"
      `,
    },
    {
      name: "Ignores non-newline whitespace with separator",
      code: dedent`
        import a from "a"
          import c from "a.png"
           import b from "b"
      `,
      options: [{ separator: "\n" }],
    },
    {
      name: "Separator without sort groups",
      code: dedent`
        import e from "a"
        import c from "a.png"
      `,
      options: [{ separator: "\n" }],
    },
    {
      name: "Separator with sort groups",
      code: dedent`
        import c from "a.png"

        import e from "a"
      `,
      options: [
        {
          groups: [
            { regex: "\\.(png|jpg)$", order: 1 },
            { type: "other", order: 2 },
          ],
          separator: "\n",
        },
      ],
    },
  ],
  invalid: [
    {
      name: "One unsorted import",
      code: dedent`
        import b from 'b'
        import a from 'a'
      `,
      output: dedent`
        import a from 'a'
        import b from 'b'
      `,
      errors: [{ messageId: "unsorted" }],
    },
    {
      name: "Two unsorted imports",
      code: dedent`
        import c from 'c'
        import b from 'b'
        import a from 'a'
      `,
      output: dedent`
        import a from 'a'
        import b from 'b'
        import c from 'c'
      `,
      errors: [{ messageId: "unsorted" }],
    },

    // Comments
    {
      name: "Comments are moved with their imports",
      code: dedent`
        // Start comment isn't moved
        import c from "c"
        // b
        import b from "b"
        // a
        import a from "a"
      `,
      output: dedent`
        // Start comment isn't moved
        // a
        import a from "a"
        // b
        import b from "b"
        import c from "c"
      `,
      errors: [{ messageId: "unsorted" }],
    },

    // Sort groups
    {
      name: "Sort groups - 1",
      code: dedent`
        import c from "a.png"
        import h from "../b"
        import b from "dependency-c"
        import d from "b.jpg"
        import a from "dependency-b"
        import i from "./b"
      `,
      output: dedent`
        import a from "dependency-b"
        import b from "dependency-c"
        import c from "a.png"
        import d from "b.jpg"
        import h from "../b"
        import i from "./b"
      `,
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
      name: "Sort groups - 2",
      code: dedent`
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
      `,
      output: dedent`
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
      `,
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
      name: "Sort groups - 3",
      code: dedent`
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
      `,
      output: dedent`
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
      `,
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

    // No separator
    {
      name: "Removes newlines between imports",
      code: dedent`
        import e from "a"

        import c from "a.png"


        import d from "b"
      `,
      output: dedent`
        import e from "a"
        import c from "a.png"
        import d from "b"
      `,
      errors: [
        {
          messageId: "extraNewlines",
          data: { newlines: "newline" },
          line: 2,
          column: 1,
          endLine: 2,
          endColumn: 1,
        },
        {
          messageId: "extraNewlines",
          data: { newlines: "newlines" },
          line: 4,
          column: 1,
          endLine: 5,
          endColumn: 1,
        },
      ],
    },
    {
      name: "Removes extra newlines between sort groups",
      code: dedent`
        import c from "a.png"


        import e from "a"

        import d from "b"
      `,
      output: dedent`
        import c from "a.png"
        import e from "a"
        import d from "b"
      `,
      errors: [
        {
          messageId: "extraNewlines",
          data: { newlines: "newlines" },
          line: 2,
          column: 1,
          endLine: 3,
          endColumn: 1,
        },
        {
          messageId: "extraNewlines",
          data: { newlines: "newline" },
          line: 5,
          column: 1,
          endLine: 5,
          endColumn: 1,
        },
      ],
      options: [
        {
          groups: [
            { regex: "\\.(png|jpg)$", order: 1 },
            { type: "other", order: 2 },
          ],
        },
      ],
    },

    // Separator
    {
      name: "Adds the separator between sort groups",
      code: dedent`
        import y from "y.png"
        import z from "z.png"
        import c from "c"
        import d from "d"
      `,
      output: dedent`
        import y from "y.png"
        import z from "z.png"

        import c from "c"
        import d from "d"
      `,
      errors: [
        {
          messageId: "missingSeparator",
          data: { separator: "\\n" },
          line: 3,
          column: 1,
          endLine: 3,
          endColumn: 1,
        },
      ],
      options: [
        {
          groups: [
            { regex: "\\.(png|jpg)$", order: 1 },
            { type: "other", order: 2 },
          ],
          separator: "\n",
        },
      ],
    },
    {
      name: "Removes extra newlines and fixes the separator size",
      code: dedent`
        import y from "y.png"

        import z from "z.png"


        import c from "c"

        import d from "d"
      `,
      output: dedent`
        import y from "y.png"
        import z from "z.png"

        import c from "c"
        import d from "d"
      `,
      errors: [
        {
          messageId: "extraNewlines",
          data: { newlines: "newline" },
          line: 2,
          column: 1,
          endLine: 2,
          endColumn: 1,
        },
        {
          messageId: "incorrectSeparator",
          data: { expected: "\\n", actual: "\\n\\n" },
          line: 4,
          column: 1,
          endLine: 5,
          endColumn: 1,
        },
        {
          messageId: "extraNewlines",
          data: { newlines: "newline" },
          line: 7,
          column: 1,
          endLine: 7,
          endColumn: 1,
        },
      ],
      options: [
        {
          groups: [
            { regex: "\\.(png|jpg)$", order: 1 },
            { type: "other", order: 2 },
          ],
          separator: "\n",
        },
      ],
    },
    {
      name: "Removes newlines and adds the separator with multiline imports",
      code: dedent`
        import {
          e,f
        } from "y.png"



        import z from "z.png"
        import {
          c,
          d
        } from "c"



        import {
          a,
          b
        } from "d"
      `,
      output: dedent`
        import {
          e,f
        } from "y.png"
        import z from "z.png"

        import {
          c,
          d
        } from "c"
        import {
          a,
          b
        } from "d"
      `,
      errors: [
        {
          messageId: "extraNewlines",
          data: { newlines: "newlines" },
          line: 4,
          column: 1,
          endLine: 6,
          endColumn: 1,
        },
        {
          messageId: "missingSeparator",
          data: { separator: "\\n" },
          line: 8,
          column: 1,
          endLine: 8,
          endColumn: 1,
        },
        {
          messageId: "extraNewlines",
          data: { newlines: "newlines" },
          line: 12,
          column: 1,
          endLine: 14,
          endColumn: 1,
        },
      ],
      options: [
        {
          groups: [
            { regex: "\\.(png|jpg)$", order: 1 },
            { type: "other", order: 2 },
          ],
          separator: "\n",
        },
      ],
    },
    {
      name: "Sorts and manages newlines at the same time",
      code: dedent`
        import d from "d"

        import z from "z.png"


        import c from "c"

        import y from "y.png"
      `,
      // This test doesn't have the correct output due to conflicting ranges,
      // but we can at least test that the right errors are present.
      output: dedent`
        import y from "y.png"

        import z from "z.png"


        import c from "c"

        import d from "d"
      `,
      errors: [
        { messageId: "unsorted" },
        {
          messageId: "extraNewlines",
          data: { newlines: "newline" },
          line: 2,
          column: 1,
          endLine: 2,
          endColumn: 1,
        },
        {
          messageId: "incorrectSeparator",
          data: { expected: "\\n", actual: "\\n\\n" },
          line: 4,
          column: 1,
          endLine: 5,
          endColumn: 1,
        },
        {
          messageId: "extraNewlines",
          data: { newlines: "newline" },
          line: 7,
          column: 1,
          endLine: 7,
          endColumn: 1,
        },
      ],
      options: [
        {
          groups: [
            { regex: "\\.(png|jpg)$", order: 1 },
            { type: "other", order: 2 },
          ],
          separator: "\n",
        },
      ],
    },
  ],
})

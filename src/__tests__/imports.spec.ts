import dedent from "dedent"
import { createRuleTester, createTsRuleTester } from "../test-utils.js"

const { default: rule } = await import("../rules/imports.js")

createRuleTester().run("imports - JS", rule, {
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

    // Case sensitivity and natural sort
    {
      code: `
        import { a1 } from 'a1'
        import { a12 } from 'a12'
        import { a2 } from 'a2'
        import { b } from 'b'
        import { C } from 'C'
      `,
      options: [{ caseSensitive: false, natural: false }],
    },
    {
      code: `
        import { C } from 'C'
        import { a1 } from 'a1'
        import { a12 } from 'a12'
        import { a2 } from 'a2'
        import { b } from 'b'
      `,
      options: [{ caseSensitive: true, natural: false }],
    },
    {
      code: `
        import { a1 } from 'a1'
        import { a2 } from 'a2'
        import { a12 } from 'a12'
        import { b } from 'b'
        import { C } from 'C'
      `,
      options: [{ caseSensitive: false, natural: true }],
    },
    {
      code: `
        import { C } from 'C'
        import { a1 } from 'a1'
        import { a2 } from 'a2'
        import { a12 } from 'a12'
        import { b } from 'b'
      `,
      options: [{ caseSensitive: true, natural: true }],
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
            { type: "side-effect", order: 10 },
            { regex: "\\.(png|jpg)$", order: 30 },
            { regex: "^\\.+\\/", order: 50 },
            { type: "dependency", order: 20 },
            { type: "other", order: 40 },
          ],
        },
      ],
    },
    {
      name: "Ignores relative paths when detecting depedencies",
      code: dedent`
        import 'index.css'
        import 'side-effect'
        import a from "dependency-b"
        import b from "dependency-c"
        import d from "b.jpg"
        import c from "../../relative-from-node-modules.js"
        import h from "../b"
        import i from "./b"
      `,
      options: [
        {
          groups: [
            { type: "side-effect", order: 10 },
            { regex: "\\.(png|jpg)$", order: 30 },
            { type: "dependency", order: 20 },
            { type: "other", order: 40 },
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
            { regex: "\\.(png|jpg)$", order: 10 },
            { type: "other", order: 20 },
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

    // Case sensitivity and natural sort
    {
      code: dedent`
        import { a2 } from 'a2'
        import { C } from 'C'
        import { a1 } from 'a1'
        import { b } from 'b'
        import { a12 } from 'a12'
      `,
      output: dedent`
        import { a1 } from 'a1'
        import { a12 } from 'a12'
        import { a2 } from 'a2'
        import { b } from 'b'
        import { C } from 'C'
      `,
      options: [{ caseSensitive: false, natural: false }],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: dedent`
        import { a2 } from 'a2'
        import { b } from 'b'
        import { a1 } from 'a1'
        import { a12 } from 'a12'
        import { C } from 'C'
      `,
      output: dedent`
        import { C } from 'C'
        import { a1 } from 'a1'
        import { a12 } from 'a12'
        import { a2 } from 'a2'
        import { b } from 'b'
      `,
      options: [{ caseSensitive: true, natural: false }],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: dedent`
        import { a12 } from 'a12'
        import { C } from 'C'
        import { b } from 'b'
        import { a2 } from 'a2'
        import { a1 } from 'a1'
      `,
      output: dedent`
        import { a1 } from 'a1'
        import { a2 } from 'a2'
        import { a12 } from 'a12'
        import { b } from 'b'
        import { C } from 'C'
      `,
      options: [{ caseSensitive: false, natural: true }],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: dedent`
        import { a2 } from 'a2'
        import { b } from 'b'
        import { a1 } from 'a1'
        import { C } from 'C'
        import { a12 } from 'a12'
      `,
      output: dedent`
        import { C } from 'C'
        import { a1 } from 'a1'
        import { a2 } from 'a2'
        import { a12 } from 'a12'
        import { b } from 'b'
      `,
      options: [{ caseSensitive: true, natural: true }],
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
            { type: "side-effect", order: 10 },
            { regex: "\\.(png|jpg)$", order: 30 },
            { regex: "^\\.+\\/", order: 50 },
            { type: "dependency", order: 20 },
            { type: "other", order: 40 },
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
            { type: "side-effect", order: 10 },
            { regex: "\\.(png|jpg)$", order: 30 },
            { regex: "^\\.+\\/", order: 50 },
            { type: "dependency", order: 20 },
            { type: "other", order: 40 },
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
            { type: "side-effect", order: 40 },
            { regex: "\\.(png|jpg)$", order: 30 },
            { type: "dependency", order: 10 },
            { type: "other", order: 20 },
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
            { regex: "\\.(png|jpg)$", order: 10 },
            { type: "other", order: 20 },
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
          data: { expected: "\\n" },
          line: 3,
          column: 1,
          endLine: 3,
          endColumn: 1,
        },
      ],
      options: [
        {
          groups: [
            { regex: "\\.(png|jpg)$", order: 10 },
            { type: "other", order: 20 },
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
            { regex: "\\.(png|jpg)$", order: 10 },
            { type: "other", order: 20 },
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
          data: { expected: "\\n" },
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
            { regex: "\\.(png|jpg)$", order: 10 },
            { type: "other", order: 20 },
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
            { regex: "\\.(png|jpg)$", order: 10 },
            { type: "other", order: 20 },
          ],
          separator: "\n",
        },
      ],
    },

    // Separators + comments
    {
      name: "Adds separators when there are comments",
      code: dedent`
        // a
        import y from "y.png"
        // b
        import z from "z.png"
        // c
        import c from "c"
        // d
        import d from "d"
      `,
      // This test doesn't have the correct output due to conflicting ranges,
      // but we can at least test that the right errors are present.
      output: dedent`
        // a
        import y from "y.png"
        // b
        import z from "z.png"

        // c
        import c from "c"
        // d
        import d from "d"
      `,
      errors: [
        {
          messageId: "missingSeparator",
          data: { expected: "\\n" },
          line: 5,
          column: 1,
          endLine: 5,
          endColumn: 1,
        },
      ],
      options: [
        {
          groups: [
            { regex: "\\.(png|jpg)$", order: 10 },
            { type: "other", order: 20 },
          ],
          separator: "\n",
        },
      ],
    },
    {
      name: "Removes extra newlines while preserving comment position",
      code: dedent`
        // a
        import y from "y.png"

        // b
        import z from "z.png"


        // c
        import c from "c"

        // d
        import d from "d"
      `,
      // This test doesn't have the correct output due to conflicting ranges,
      // but we can at least test that the right errors are present.
      output: dedent`
        // a
        import y from "y.png"
        // b
        import z from "z.png"

        // c
        import c from "c"
        // d
        import d from "d"
      `,
      errors: [
        {
          messageId: "extraNewlines",
          data: { newlines: "newline" },
          line: 3,
          column: 1,
          endLine: 3,
          endColumn: 1,
        },
        {
          messageId: "incorrectSeparator",
          data: { expected: "\\n", actual: "\\n\\n" },
          line: 6,
          column: 1,
          endLine: 7,
          endColumn: 1,
        },
        {
          messageId: "extraNewlines",
          data: { newlines: "newline" },
          line: 10,
          column: 1,
          endLine: 10,
          endColumn: 1,
        },
      ],
      options: [
        {
          groups: [
            { regex: "\\.(png|jpg)$", order: 10 },
            { type: "other", order: 20 },
          ],
          separator: "\n",
        },
      ],
    },

    {
      name: "Does not sort when there is code between imports",
      errors: [{ messageId: "codeBetweenImports" }],
      code: dedent`
        import b from 'b'
        const foo = 'foo'
        const bar = 'bar'
        import a from 'a'

        import e from 'e'
        const baz = 'baz'
        import d from 'd'
        import c from 'c'
      `,
    },
  ],
})

// TypeScript rules
createTsRuleTester().run("imports - TS", rule, {
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
    {
      name: "import = require()",
      code: dedent`
        import a from 'a'
        import b = require('b');
        import c from 'c'
      `,
    },

    // typeOrder
    {
      name: "typeOrder: keep",
      code: dedent`
        import { a } from 'a'
        import type { a } from 'a'
        import type { b } from 'b'
        import { b } from 'b'
      `,
    },
    {
      name: "typeOrder: last",
      code: dedent`
        import { a } from 'a'
        import type { a } from 'a'
        import { b } from 'b'
        import type { b } from 'b'
      `,
      options: [{ typeOrder: "last" }],
    },
    {
      name: "typeOrder: first",
      code: dedent`
        import type { a } from 'a'
        import { a } from 'a'
        import type { b } from 'b'
        import { b } from 'b'
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
        import type { A } from "dependency-a"
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
            { type: "side-effect", order: 10 },
            { type: "type", order: 30 },
            { regex: "\\.(png|jpg)$", order: 40 },
            { regex: "^\\.+\\/", order: 60 },
            { type: "dependency", order: 20 },
            { type: "other", order: 50 },
          ],
        },
      ],
    },
    {
      name: "Sort groups - import = require()",
      code: dedent`
        import 'index.css'
        import 'side-effect'
        import a from "dependency-b"
        import b from "dependency-c"
        import type { A } from "dependency-a"
        import c from "a.png"
        import d from "b.jpg"
        import e = require("a")
        import f from "b"
        import g from "c"
        import h from "../b"
        import i from "./b"
      `,
      options: [
        {
          groups: [
            { type: "side-effect", order: 10 },
            { type: "type", order: 30 },
            { regex: "\\.(png|jpg)$", order: 40 },
            { regex: "^\\.+\\/", order: 60 },
            { type: "dependency", order: 20 },
            { type: "other", order: 50 },
          ],
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
    {
      name: "import = require()",
      code: dedent`
        import c from 'c'
        import b = require('b')
        import a from 'a'
      `,
      output: dedent`
        import a from 'a'
        import b = require('b')
        import c from 'c'
      `,
      errors: [{ messageId: "unsorted" }],
    },

    // typeOrder
    {
      name: "typeOrder: keep",
      code: dedent`
        import type { b } from 'b'
        import { b } from 'b'
        import { a } from 'a'
        import type { a } from 'a'
      `,
      output: dedent`
        import { a } from 'a'
        import type { a } from 'a'
        import type { b } from 'b'
        import { b } from 'b'
      `,
      errors: [{ messageId: "unsorted" }],
    },
    {
      name: "typeOrder: last",
      code: dedent`
        import type { a } from 'a'
        import { a } from 'a'
        import type { b } from 'b'
        import { b } from 'b'
      `,
      output: dedent`
        import { a } from 'a'
        import type { a } from 'a'
        import { b } from 'b'
        import type { b } from 'b'
      `,
      options: [{ typeOrder: "last" }],
      errors: [{ messageId: "unsorted" }],
    },
    {
      name: "typeOrder: first",
      code: dedent`
        import { a } from 'a'
        import type { a } from 'a'
        import { b } from 'b'
        import type { b } from 'b'
      `,
      output: dedent`
        import type { a } from 'a'
        import { a } from 'a'
        import type { b } from 'b'
        import { b } from 'b'
      `,
      options: [{ typeOrder: "first" }],
      errors: [{ messageId: "unsorted" }],
    },

    // Sort groups
    {
      name: "Sort groups",
      code: dedent`
        import c from "a.png"
        import h from "../b"
        import b from "dependency-c"
        import type { A } from "dependency-a"
        import d from "b.jpg"
        import a from "dependency-b"
        import i from "./b"
      `,
      output: dedent`
        import a from "dependency-b"
        import b from "dependency-c"
        import type { A } from "dependency-a"
        import c from "a.png"
        import d from "b.jpg"
        import h from "../b"
        import i from "./b"
      `,
      errors: [{ messageId: "unsorted" }],
      options: [
        {
          groups: [
            { type: "type", order: 30 },
            { regex: "\\.(png|jpg)$", order: 40 },
            { regex: "^\\.+\\/", order: 60 },
            { type: "dependency", order: 20 },
            { type: "other", order: 50 },
          ],
        },
      ],
    },
    {
      name: "Sort groups - import = require()",
      code: dedent`
        import c from "a.png"
        import h = require("../b")
        import "./styles.css"
        import b from "dependency-c"
        import type { A } from "dependency-a"
        import d = require("b.jpg")
        import a from "dependency-b"
        import i from "./b"
      `,
      output: dedent`
        import a from "dependency-b"
        import b from "dependency-c"
        import type { A } from "dependency-a"
        import c from "a.png"
        import d = require("b.jpg")
        import h = require("../b")
        import i from "./b"
        import "./styles.css"
      `,
      errors: [{ messageId: "unsorted" }],
      options: [
        {
          groups: [
            { type: "side-effect", order: 60 },
            { type: "type", order: 30 },
            { regex: "\\.(png|jpg)$", order: 40 },
            { regex: "^\\.+\\/", order: 60 },
            { type: "dependency", order: 20 },
            { type: "other", order: 50 },
          ],
        },
      ],
    },
    {
      name: "Ignores relative paths when detecting depedencies",
      code: dedent`
        import 'index.css'
        import c from "../../relative-from-node-modules.js"
        import b from "dependency-c"
        import d from "b.jpg"
        import 'side-effect'
        import h from "../b"
        import a from "dependency-b"
        import i from "./b"
      `,
      errors: [{ messageId: "unsorted" }],
      output: dedent`
        import 'index.css'
        import 'side-effect'
        import a from "dependency-b"
        import b from "dependency-c"
        import d from "b.jpg"
        import c from "../../relative-from-node-modules.js"
        import h from "../b"
        import i from "./b"
      `,
      options: [
        {
          groups: [
            { type: "side-effect", order: 10 },
            { regex: "\\.(png|jpg)$", order: 30 },
            { type: "dependency", order: 20 },
            { type: "other", order: 40 },
          ],
        },
      ],
    },
  ],
})

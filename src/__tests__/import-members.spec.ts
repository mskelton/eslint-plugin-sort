import { RuleTester } from "eslint"
import rule from "../rules/import-members.js"
import { createValidCodeVariants } from "../test-utils.js"

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
})

ruleTester.run("sort/import-members", rule, {
  valid: [
    ...createValidCodeVariants("import {} from 'a'"),
    ...createValidCodeVariants("import { a } from 'a'"),
    ...createValidCodeVariants("import { a, b, c } from 'a'"),
    ...createValidCodeVariants("import { _, a, b } from 'a'"),
    ...createValidCodeVariants(
      "import { p, q, r, s, t, u, v, w, x, y, z } from 'a'"
    ),

    // Default and namespace imports
    ...createValidCodeVariants("import React from 'a'"),
    ...createValidCodeVariants("import * as React from 'a'"),
    ...createValidCodeVariants("import React, { a, b } from 'a'"),

    // Import aliases
    ...createValidCodeVariants("import { a as b, b as a } from 'a'"),

    // Comments
    ...createValidCodeVariants(
      `
      import {
        // a
        a,
        // b
        b,
        c
      } from 'a'
    `.trim()
    ),

    // Case sensitive
    {
      code: "import { a, B, C, c } from 'a'",
      options: [{ caseSensitive: false, natural: false }],
    },
    {
      code: "import { a, B, c, C } from 'a'",
      options: [{ caseSensitive: true, natural: false }],
    },
    {
      code: "import { a, B, C, c } from 'a'",
      options: [{ caseSensitive: false, natural: true }],
    },
    {
      code: "import { B, C, a, c } from 'a'",
      options: [{ caseSensitive: true, natural: true }],
    },
  ],
  invalid: [
    {
      code: "import {c, a, b} from 'a'",
      output: "import {a, b, c} from 'a'",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "import {b, a, _} from 'a'",
      output: "import {_, a, b} from 'a'",
      errors: [{ messageId: "unsorted" }],
    },

    // Case insensitive
    {
      code: "import {b, A, _} from 'a'",
      output: "import {_, A, b} from 'a'",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "import {D, a, c, B} from 'a'",
      output: "import {a, B, c, D} from 'a'",
      errors: [{ messageId: "unsorted" }],
    },

    // Default and namespace imports
    {
      code: "import React, {c, a, b} from 'a'",
      output: "import React, {a, b, c} from 'a'",
      errors: [{ messageId: "unsorted" }],
    },

    // Import aliases
    {
      code: "import {b as a, a as b} from 'a'",
      output: "import {a as b, b as a} from 'a'",
      errors: [{ messageId: "unsorted" }],
    },

    // All properties are sorted with a single sort
    {
      code: "import {z,y,x,w,v,u,t,s,r,q,p} from 'a'",
      output: "import {p,q,r,s,t,u,v,w,x,y,z} from 'a'",
      errors: [{ messageId: "unsorted" }],
    },

    // Comments
    {
      code: `
        import {
          c,
          // b
          b,
          // a
          a
        } from 'a'
      `.trim(),
      output: `
        import {
          // a
          a,
          // b
          b,
          c
        } from 'a'
      `.trim(),
      errors: [{ messageId: "unsorted" }],
    },
  ],
})

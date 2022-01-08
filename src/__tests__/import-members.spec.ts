import { RuleTester } from "eslint"
import rule from "../rules/import-members"
import { heredoc } from "./utils"

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
})

ruleTester.run("sort/imported-variables", rule, {
  valid: [
    "import {} from 'a'",
    "import {a} from 'a'",
    "import {a, b, c} from 'a'",
    "import {_, a, b} from 'a'",
    "import {p,q,r,s,t,u,v,w,x,y,z} from 'a'",

    // Case insensitive
    "import {a, B, c, D} from 'a'",
    "import {_, A, b} from 'a'",

    // Default and namespace imports
    "import React from 'a'",
    "import * as React from 'a'",
    "import React, {a, b} from 'a'",

    // Import aliases
    "import {a as b, b as a} from 'a'",

    // Comments
    heredoc(`
      import {
        // a
        a,
        // b
        b,
        c
      } from 'a'
    `),
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
      code: heredoc(`
        import {
          c,
          // b
          b,
          // a
          a
        } from 'a'
      `),
      output: heredoc(`
        import {
          // a
          a,
          // b
          b,
          c
        } from 'a'
      `),
      errors: [{ messageId: "unsorted" }],
    },
  ],
})

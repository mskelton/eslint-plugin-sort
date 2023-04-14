import { TSESLint } from "@typescript-eslint/experimental-utils"
import rule from "../rules/string-unions.js"
import { createTsRuleTester } from "../test-utils.js"

const ruleTester = createTsRuleTester()

const createValidCodeVariants = (
  code: string
): TSESLint.RunTests<
  "unsorted",
  [{ caseSensitive?: boolean; natural?: boolean }]
>["valid"] => [
  { code, options: [{ caseSensitive: false, natural: false }] },
  { code, options: [{ caseSensitive: true, natural: false }] },
  { code, options: [{ caseSensitive: false, natural: true }] },
  { code, options: [{ caseSensitive: true, natural: true }] },
]

ruleTester.run("sort/string-unions", rule, {
  valid: [
    ...createValidCodeVariants("type A = 'a'"),
    ...createValidCodeVariants("type A = 'a' | 'b'"),
    ...createValidCodeVariants("type A = '_' | 'a' | 'b'"),

    // Ignores mixed types
    ...createValidCodeVariants("type A = 'b' | 'a' | boolean"),
    ...createValidCodeVariants("type A = 'b' | {type:string} | 'a'"),

    // Options
    {
      code: "type A = 'a1' | 'A1' | 'a12' | 'a2' | 'B2'",
      options: [{ caseSensitive: false, natural: false }],
    },
    {
      code: "type A = 'A1' | 'B1' | 'a1' | 'a12' | 'a2'",
      options: [{ caseSensitive: true, natural: false }],
    },
    {
      code: "type A = 'a1' | 'A1' | 'a2' | 'a12' | 'B2'",
      options: [{ caseSensitive: false, natural: true }],
    },
    {
      code: "type A = 'A1' | 'B2' | 'a1' | 'a2' | 'a12'",
      options: [{ caseSensitive: true, natural: true }],
    },
  ],
  invalid: [
    {
      code: "type A = 'b' | 'a'",
      output: "type A = 'a' | 'b'",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "type A = 'b' | 'a' | 'c'",
      output: "type A = 'a' | 'b' | 'c'",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "type A = 'b' | '_' | 'c'",
      output: "type A = '_' | 'b' | 'c'",
      errors: [{ messageId: "unsorted" }],
    },

    // Options
    {
      code: "type A = 'a12' | 'B2' | 'a1' | 'a2'",
      output: "type A = 'a1' | 'a12' | 'a2' | 'B2'",
      options: [{ caseSensitive: false, natural: false }],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "type A = 'a1' | 'B2' | 'a2' | 'a12'",
      output: "type A = 'B2' | 'a1' | 'a12' | 'a2'",
      options: [{ caseSensitive: true, natural: false }],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "type A = 'a2' | 'a1' | 'a12' | 'B2'",
      output: "type A = 'a1' | 'a2' | 'a12' | 'B2'",
      options: [{ caseSensitive: false, natural: true }],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "type A = 'a12' | 'a2' | 'B2' | 'a1'",
      output: "type A = 'B2' | 'a1' | 'a2' | 'a12'",
      options: [{ caseSensitive: true, natural: true }],
      errors: [{ messageId: "unsorted" }],
    },
  ],
})

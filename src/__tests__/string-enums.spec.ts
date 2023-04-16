import { TSESLint } from "@typescript-eslint/experimental-utils"
import rule from "../rules/string-enums.js"
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

ruleTester.run("sort/string-enums", rule, {
  valid: [
    ...createValidCodeVariants("enum Foo {A='a'}"),
    ...createValidCodeVariants("enum Foo {a='a', b='b'}"),
    ...createValidCodeVariants("enum Foo {_='_', a='a', b='b'}"),

    // Ignores mixed types
    ...createValidCodeVariants("enum Foo {b='b', a='a', c=1}"),

    // Options
    {
      code: "enum Foo {a1='a1', A1='A1', a12='a12', a2='a2', B2='B2'}",
      options: [{ caseSensitive: false, natural: false }],
    },
    {
      code: "enum Foo {A1='A1', B1='B1', a1='a1', a12='a12', a2='a2'}",
      options: [{ caseSensitive: true, natural: false }],
    },
    {
      code: "enum Foo {a1='a1', A1='A1', a2='a2', a12='a12', B2='B2'}",
      options: [{ caseSensitive: false, natural: true }],
    },
    {
      code: "enum Foo {A1='A1', B2='B2', a1='a1', a2='a2', a12='a12'}",
      options: [{ caseSensitive: true, natural: true }],
    },
  ],
  invalid: [
    {
      code: "enum Foo {b='b', a='a'}",
      output: "enum Foo {a='a', b='b'}",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "enum Foo {b='b', a='a', c='c'}",
      output: "enum Foo {a='a', b='b', c='c'}",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "enum Foo {b='b', _='_', c='c'}",
      output: "enum Foo {_='_', b='b', c='c'}",
      errors: [{ messageId: "unsorted" }],
    },

    // Options
    {
      code: "enum Foo {a12='a12', B2='B2', a1='a1', a2='a2'}",
      output: "enum Foo {a1='a1', a12='a12', a2='a2', B2='B2'}",
      options: [{ caseSensitive: false, natural: false }],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "enum Foo {a1='a1', B2='B2', a2='a2', a12='a12'}",
      output: "enum Foo {B2='B2', a1='a1', a12='a12', a2='a2'}",
      options: [{ caseSensitive: true, natural: false }],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "enum Foo {a2='a2', a1='a1', a12='a12', B2='B2'}",
      output: "enum Foo {a1='a1', a2='a2', a12='a12', B2='B2'}",
      options: [{ caseSensitive: false, natural: true }],
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "enum Foo {a12='a12', a2='a2', B2='B2', a1='a1'}",
      output: "enum Foo {B2='B2', a1='a1', a2='a2', a12='a12'}",
      options: [{ caseSensitive: true, natural: true }],
      errors: [{ messageId: "unsorted" }],
    },
  ],
})

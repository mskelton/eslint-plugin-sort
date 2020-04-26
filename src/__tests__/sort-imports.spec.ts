import { RuleTester } from "eslint"
import rule from "../rules/sort-imports"
import { invalidFixture, validFixture } from "./utils"

const messages = rule.meta!.messages! as Record<
  "unsorted" | "unsortedImports",
  string
>

const code = (...names: string[]) =>
  names.map((name) => `import ${name}`).join("\n")

const valid = (...names: string[]) => ({
  code: code(...names.map((name, index) => `a${index} from '${name}'`)),
})

const invalid = (input: string, output: string, ...errors: string[]) => ({
  code: input,
  errors,
  output,
})

const error = (a: string, b: string) =>
  messages.unsorted.replace("{{a}}", a).replace("{{b}}", b)

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
})

ruleTester.run("sort/imported-variables", rule, {
  valid: [
    // Basic
    valid("a"),
    valid("a", "b"),
    valid("a", "b", "c"),

    // Programs without imports are valid
    { code: "var a = 1" },

    // Comments
    validFixture("imports/valid-comments"),
  ],
  invalid: [
    // Basic
    invalid(
      code("b from 'b'", "a from 'a'"),
      code("a from 'a'", "b from 'b'"),
      error("a", "b"),
      messages.unsortedImports
    ),
    invalid(
      code("c from 'c'", "b from 'b'", "a from 'a'"),
      code("a from 'a'", "b from 'b'", "c from 'c'"),
      error("b", "c"),
      error("a", "b"),
      messages.unsortedImports
    ),

    // Comments
    invalidFixture(
      "imports/invalid-comments",
      error("b", "c"),
      error("a", "b"),
      messages.unsortedImports
    ),
  ],
})

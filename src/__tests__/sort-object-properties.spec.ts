import { RuleTester } from "eslint"
import rule from "../rules/sort-object-properties"
import { invalidFixture, validFixture } from "./utils"

const messages = rule.meta!.messages! as Record<
  "unsorted" | "unsortedProperties",
  string
>

const valid = (input: string) => ({ code: `var a = ${input}` })

const invalid = (
  input: string,
  output: string,
  ...errors: string[]
): RuleTester.InvalidTestCase => ({
  code: `var a = ${input}`,
  errors,
  output: `var a = ${output}`,
})

const error = (a: string, b: string) =>
  messages.unsorted.replace("{{a}}", a).replace("{{b}}", b)

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
  },
})

ruleTester.run("sort/destructured-properties", rule, {
  valid: [
    // Basic
    valid("{}"),
    valid("{a: 1}"),
    valid("{a: 1, b: 2, c: 3}"),
    valid("{_:1, a:2, b:3}"),
    valid("{1:'a', 2:'b'}"),

    // Case insensitive
    valid("{a:1, B:2, c:3, D:4}"),
    valid("{_:1, A:2, b:3}"),

    // Bracket notation
    valid("{['a']: 1, ['b']: 2}"),
    valid("{[`a`]: 1, [`b`]: 2}"),
    valid("{[1]: 'a', [2]: 'b'}"),

    // Spread elements
    valid("{a:1, b:2, ...c, d:3, e:4}"),
    valid("{d:1, e:2, ...c, a:3, b:4}"),
    valid("{e:1, f:2, ...d, ...c, a:3, b:4}"),
    valid("{f:1, g:2, ...d, a:3, ...c, b:4, c:5}"),

    // Comments
    validFixture("object-properties/valid-comments"),
  ],
  invalid: [
    invalid(
      "{b:2, a:1}",
      "{a:1, b:2}",
      messages.unsortedProperties,
      error("a", "b")
    ),
    invalid(
      "{b:3, a:2, _:1}",
      "{_:1, a:2, b:3}",
      messages.unsortedProperties,
      error("a", "b"),
      error("_", "a")
    ),
    invalid(
      "{2:'b', 1:'a'}",
      "{1:'a', 2:'b'}",
      messages.unsortedProperties,
      error("a", "b")
    ),

    // // Case insensitive
    // invalid("{a:1, B:2, c:3, D:4}"),
    // invalid("{_:1, A:2, b:3}"),

    // // Bracket notation
    // invalid("{['a']: 1, ['b']: 2}"),
    // invalid("{[`a`]: 1, [`b`]: 2}"),
    // invalid("{[1]: 'a', [2]: 'b'}"),

    // // Spread elements
    // invalid("{a:1, b:2, ...c, d:3, e:4}"),
    // invalid("{d:1, e:2, ...c, a:3, b:4}"),
    // invalid("{e:1, f:2, ...d, ...c, a:3, b:4}"),
    // invalid("{f:1, g:2, ...d, a:3, ...c, b:4, c:5}"),
  ],
})

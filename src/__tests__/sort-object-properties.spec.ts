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
    valid("{[1]: 'a', [2]: 'b'}"),

    // Template literals
    valid("{[`a`]: 1, [`b`]: 2}"),
    valid("{[`a${b}c${d}`]: 1, [`a${c}e${g}`]: 2}"),
    valid("{[`${a}b${c}d`]: 1, [`${a}c${e}g`]: 2}"),

    // Spread elements
    valid("{a:1, b:2, ...c, d:3, e:4}"),
    valid("{d:1, e:2, ...c, a:3, b:4}"),
    valid("{e:1, f:2, ...d, ...c, a:3, b:4}"),
    valid("{f:1, g:2, ...d, a:3, ...c, b:4, c:5}"),

    // Nested properties
    valid("{a:1, b:{x:2, y:3}, c:4}"),

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
      error("1", "2")
    ),

    // Case insensitive
    invalid(
      "{D:4, B:2, a:1, c:3}",
      "{a:1, B:2, c:3, D:4}",
      messages.unsortedProperties,
      error("B", "D"),
      error("a", "B")
    ),
    invalid(
      "{b:3, A:2, _:1}",
      "{_:1, A:2, b:3}",
      messages.unsortedProperties,
      error("A", "b"),
      error("_", "A")
    ),

    // Spread elements
    invalid(
      "{e:2, d:1, ...c, b:4, a:3}",
      "{d:1, e:2, ...c, a:3, b:4}",
      messages.unsortedProperties,
      error("d", "e"),
      error("a", "b")
    ),
    invalid(
      "{b:2, a:1, ...c, e:4, d:3}",
      "{a:1, b:2, ...c, d:3, e:4}",
      messages.unsortedProperties,
      error("a", "b"),
      error("d", "e")
    ),
    invalid(
      "{f:2, e:1, ...d, ...c, b:4, a:3}",
      "{e:1, f:2, ...d, ...c, a:3, b:4}",
      messages.unsortedProperties,
      error("e", "f"),
      error("a", "b")
    ),
    invalid(
      "{g:2, f:1, ...d, a:3, ...c, c:5, b:4}",
      "{f:1, g:2, ...d, a:3, ...c, b:4, c:5}",
      messages.unsortedProperties,
      error("f", "g"),
      error("b", "c")
    ),

    // Bracket notation
    invalid(
      "{['b']: 2, ['a']: 1}",
      "{['a']: 1, ['b']: 2}",
      messages.unsortedProperties,
      error("a", "b")
    ),
    invalid(
      "{[2]: 'b', [1]: 'a'}",
      "{[1]: 'a', [2]: 'b'}",
      messages.unsortedProperties,
      error("1", "2")
    ),

    // Template literals
    invalid(
      "{[`b`]: 2, [`a`]: 1}",
      "{[`a`]: 1, [`b`]: 2}",
      messages.unsortedProperties,
      error("a", "b")
    ),
    invalid(
      "{[`a${c}e${g}`]: 2, [`a${b}c${d}`]: 1}",
      "{[`a${b}c${d}`]: 1, [`a${c}e${g}`]: 2}",
      messages.unsortedProperties,
      error("abcd", "aceg")
    ),
    invalid(
      "{[`${a}c${e}g`]: 2, [`${a}b${c}d`]: 1}",
      "{[`${a}b${c}d`]: 1, [`${a}c${e}g`]: 2}",
      messages.unsortedProperties,
      error("abcd", "aceg")
    ),

    // Nested properties
    invalid(
      "{c:4, b:{y:3, x:2}, a:1}",
      // Because RuleTester runs autofixing only once, nested properties don't
      // appear to be fixed even though they will be fixed in real world usage.
      "{a:1, b:{y:3, x:2}, c:4}",
      messages.unsortedProperties,
      error("b", "c"),
      messages.unsortedProperties,
      error("x", "y"),
      error("a", "b")
    ),

    // Comments
    invalidFixture(
      "object-properties/invalid-comments",
      messages.unsortedProperties,
      error("c", "d"),
      error("a", "b")
    ),
  ],
})

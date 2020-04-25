import { RuleTester } from "eslint"
import rule from "../rules/sort-import-specifiers"
import { invalidFixture, validFixture } from "./utils"

const messages = rule.meta!.messages! as Record<
  "unsorted" | "unsortedSpecifiers",
  string
>

const valid = (input: string) => ({ code: `import ${input} from 'a'` })

const invalid = (input: string, output: string, ...errors: string[]) => ({
  code: `import ${input} from 'a'`,
  errors,
  output: `import ${output} from 'a'`,
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
    valid("{}"),
    valid("{a}"),
    valid("{a, b, c}"),
    valid("{_, a, b}"),
    valid("{p,q,r,s,t,u,v,w,x,y,z}"),

    // Case insensitive
    valid("{a, B, c, D}"),
    valid("{_, A, b}"),

    // Default and namespace imports
    valid("React"),
    valid("* as React"),
    valid("React, {a, b}"),

    // Import aliases
    valid("{a as b, b as a}"),

    // Comments
    validFixture("import-specifiers/valid-comments"),
  ],
  invalid: [
    // Basic
    invalid(
      "{c, a, b}",
      "{a, b, c}",
      messages.unsortedSpecifiers,
      error("a", "c")
    ),
    invalid(
      "{b, a, _}",
      "{_, a, b}",
      messages.unsortedSpecifiers,
      error("a", "b"),
      error("_", "a")
    ),

    // Case insensitive
    invalid(
      "{b, A, _}",
      "{_, A, b}",
      messages.unsortedSpecifiers,
      error("A", "b"),
      error("_", "A")
    ),
    invalid(
      "{D, a, c, B}",
      "{a, B, c, D}",
      messages.unsortedSpecifiers,
      error("a", "D"),
      error("B", "c")
    ),

    // Default and namespace imports
    invalid(
      "React, {c, a, b}",
      "React, {a, b, c}",
      messages.unsortedSpecifiers,
      error("a", "c")
    ),

    // Import aliases
    invalid(
      "{b as a, a as b}",
      "{a as b, b as a}",
      messages.unsortedSpecifiers,
      error("a", "b")
    ),

    // All properties are sorted with a single sort
    invalid(
      "{z,y,x,w,v,u,t,s,r,q,p}",
      "{p,q,r,s,t,u,v,w,x,y,z}",
      messages.unsortedSpecifiers,
      error("y", "z"),
      error("x", "y"),
      error("w", "x"),
      error("v", "w"),
      error("u", "v"),
      error("t", "u"),
      error("s", "t"),
      error("r", "s"),
      error("q", "r"),
      error("p", "q")
    ),

    // Comments
    invalidFixture(
      "import-specifiers/invalid-comments",
      messages.unsortedSpecifiers,
      error("b", "c"),
      error("a", "b")
    ),
  ],
})

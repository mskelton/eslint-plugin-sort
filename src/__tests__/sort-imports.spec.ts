jest.mock("../resolver")

import { RuleTester } from "eslint"
import rule, { SortGroup } from "../rules/sort-imports"
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

const sortGroups = (separator: string, ...groups: SortGroup[]) => [
  { groups, separator },
]

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

    // Sort groups
    validFixture(
      "imports/valid-sort-groups",
      sortGroups(
        "\n",
        { type: "side-effect", order: 1 },
        { regex: "\\.(png|jpg)$", order: 3 },
        { regex: "^\\.+\\/", order: 5 },
        { type: "dependency", order: 2 },
        { type: "other", order: 4 }
      )
    ),
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
    invalidFixture("imports/invalid-comments", [
      error("b", "c"),
      error("a", "b"),
      messages.unsortedImports,
    ]),

    // Sort groups
    invalidFixture(
      "imports/invalid-sort-groups",
      [
        error("c", "../b"),
        error("b", "./b"),
        error("a.png", "b"),
        error("side-effect", "a.png"),
        error("index.css", "side-effect"),
        error("dependency-b", "b.jpg"),
        messages.unsortedImports,
      ],
      sortGroups(
        "\n",
        { type: "side-effect", order: 1 },
        { regex: "\\.(png|jpg)$", order: 3 },
        { regex: "^\\.+\\/", order: 5 },
        { type: "dependency", order: 2 },
        { type: "other", order: 4 }
      )
    ),
    invalidFixture(
      "imports/invalid-sort-groups-2",
      [
        error("./b", "c"),
        error("index.css", "side-effect"),
        error("b.jpg", "index.css"),
        error("dependency-b", "b.jpg"),
        messages.unsortedImports,
      ],
      sortGroups(
        "\n",
        { type: "side-effect", order: 4 },
        { regex: "\\.(png|jpg)$", order: 3 },
        { type: "dependency", order: 1 },
        { type: "other", order: 2 }
      )
    ),

    // No separator
    invalidFixture(
      "imports/invalid-no-separator",
      [
        error("dependency-c", "../b"),
        error("dependency-b", "b.jpg"),
        messages.unsortedImports,
      ],
      sortGroups(
        "",
        { type: "side-effect", order: 1 },
        { regex: "\\.(png|jpg)$", order: 3 },
        { regex: "^\\.+\\/", order: 5 },
        { type: "dependency", order: 2 },
        { type: "other", order: 4 }
      )
    ),

    // Custom separator
    invalidFixture(
      "imports/invalid-custom-separator",
      [
        error("dependency-c", "../b"),
        error("dependency-b", "b.jpg"),
        messages.unsortedImports,
      ],
      sortGroups(
        "/* separator */",
        { type: "side-effect", order: 1 },
        { regex: "\\.(png|jpg)$", order: 3 },
        { regex: "^\\.+\\/", order: 5 },
        { type: "dependency", order: 2 },
        { type: "other", order: 4 }
      )
    ),
  ],
})

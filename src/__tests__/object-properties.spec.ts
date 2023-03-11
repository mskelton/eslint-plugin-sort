import { RuleTester } from "eslint"
import rule from "../rules/object-properties.js"
import { createValidCodeVariants } from "../test-utils.js"

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
  },
})

ruleTester.run("sort/object-properties", rule, {
  valid: [
    // Empty object
    ...createValidCodeVariants("var a = {}"),

    // Single property
    ...createValidCodeVariants("var a = { a: 1 }"),

    // Multiple properties
    ...createValidCodeVariants("var a = { a: 1, b: 2, c: 3 }"),

    // Multiple properties with special characters
    ...createValidCodeVariants("var a = { _: 1, a: 2, b: 3 }"),

    // Bracket notation
    ...createValidCodeVariants("var a = { ['a']: 1, ['b']: 2 }"),
    ...createValidCodeVariants("var a = { [1]: 'a', [2]: 'b' }"),

    // Template literals
    ...createValidCodeVariants("var a = { [`a`]: 1, [`b`]: 2 }"),
    ...createValidCodeVariants(
      "var a = { [`a${b}c${d}`]: 1, [`a${c}e${g}`]: 2 }"
    ),
    ...createValidCodeVariants(
      "var a = { [`${a}b${c}d`]: 1, [`${a}c${e}g`]: 2 }"
    ),

    // Spread elements
    ...createValidCodeVariants("var a = { a: 1, b: 2, ...c, d: 3, e: 4 }"),
    ...createValidCodeVariants("var a = { d: 1, e: 2, ...c, a: 3, b: 4 }"),
    ...createValidCodeVariants(
      "var a = { e: 1, f: 2, ...d, ...c, a: 3, b: 4 }"
    ),
    ...createValidCodeVariants(
      "var a = { f: 1, g: 2, ...d, a: 3, ...c, b: 4, c: 5 }"
    ),

    // Nested properties
    ...createValidCodeVariants("var a = { a: 1, b: { x: 2, y: 3 }, c: 4 }"),

    // Comments
    ...createValidCodeVariants(
      `
        var a = {
          // c
          c: 1,
          // d
          d: 2,
          ...spread1,
          // spread 2
          ...spread2,
          a: 3,
          b: 4
        }
      `.trim()
    ),

    // Numeric properties
    {
      code: "var a = { 1: 'a', 11: 'b', 2: 'c' }",
      options: [{ caseSensitive: false, natural: false }],
    },
    {
      code: "var a = { 1: 'a', 11: 'b', 2: 'c' }",
      options: [{ caseSensitive: true, natural: false }],
    },
    {
      code: "var a = { 1: 'a', 2: 'c', 11: 'b' }",
      options: [{ caseSensitive: false, natural: true }],
    },
    {
      code: "var a = { 1: 'a', 2: 'c', 11: 'b' }",
      options: [{ caseSensitive: true, natural: true }],
    },

    // Numeric properties + bracket notation
    {
      code: "var a = { [1]: 'a', [11]: 'b', [2]: 'c' }",
      options: [{ caseSensitive: false, natural: false }],
    },
    {
      code: "var a = { [1]: 'a', [11]: 'b', [2]: 'c' }",
      options: [{ caseSensitive: true, natural: false }],
    },
    {
      code: "var a = { [1]: 'a', [2]: 'c', [11]: 'b' }",
      options: [{ caseSensitive: false, natural: true }],
    },
    {
      code: "var a = { [1]: 'a', [2]: 'c', [11]: 'b' }",
      options: [{ caseSensitive: true, natural: true }],
    },

    // Case sensitive
    {
      code: "var a = { a: 1, B: 2, c: 3, C: 4 }",
      options: [{ caseSensitive: false, natural: false }],
    },
    {
      code: "var a = { a: 1, B: 2, c: 3, C: 4 }",
      options: [{ caseSensitive: true, natural: false }],
    },
    {
      code: "var a = { a: 1, B: 2, c: 3, C: 4 }",
      options: [{ caseSensitive: false, natural: true }],
    },
    {
      code: "var a = { B: 2, C: 4, a: 1, c: 3 }",
      options: [{ caseSensitive: true, natural: true }],
    },

    // Case sensitive + bracket notation
    {
      code: "var a = { ['a']: 1, ['B']: 2, ['c']: 3, ['C']: 4 }",
      options: [{ caseSensitive: false, natural: false }],
    },
    {
      code: "var a = { ['a']: 1, ['B']: 2, ['c']: 3, ['C']: 4, }",
      options: [{ caseSensitive: true, natural: false }],
    },
    {
      code: "var a = { ['a']: 1, ['B']: 2, ['c']: 3, ['C']: 4 }",
      options: [{ caseSensitive: false, natural: true }],
    },
    {
      code: "var a = { ['B']: 2, ['C']: 4, ['a']: 1, ['c']: 3 }",
      options: [{ caseSensitive: true, natural: true }],
    },
  ],
  invalid: [
    {
      code: "var a = {b:2, a:1}",
      output: "var a = {a:1, b:2}",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "var a = {b:3, a:2, _:1}",
      output: "var a = {_:1, a:2, b:3}",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "var a = {2:'b', 1:'a'}",
      output: "var a = {1:'a', 2:'b'}",
      errors: [{ messageId: "unsorted" }],
    },

    // Case insensitive
    {
      code: "var a = {D:4, B:2, a:1, c:3}",
      output: "var a = {a:1, B:2, c:3, D:4}",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "var a = {b:3, A:2, _:1}",
      output: "var a = {_:1, A:2, b:3}",
      errors: [{ messageId: "unsorted" }],
    },

    // Spread elements
    {
      code: "var a = {e:2, d:1, ...c, b:4, a:3}",
      output: "var a = {d:1, e:2, ...c, a:3, b:4}",
      errors: [{ messageId: "unsorted" }, { messageId: "unsorted" }],
    },
    {
      code: "var a = {b:2, a:1, ...c, e:4, d:3}",
      output: "var a = {a:1, b:2, ...c, d:3, e:4}",
      errors: [{ messageId: "unsorted" }, { messageId: "unsorted" }],
    },
    {
      code: "var a = {f:2, e:1, ...d, ...c, b:4, a:3}",
      output: "var a = {e:1, f:2, ...d, ...c, a:3, b:4}",
      errors: [{ messageId: "unsorted" }, { messageId: "unsorted" }],
    },
    {
      code: "var a = {g:2, f:1, ...d, a:3, ...c, c:5, b:4}",
      output: "var a = {f:1, g:2, ...d, a:3, ...c, b:4, c:5}",
      errors: [{ messageId: "unsorted" }, { messageId: "unsorted" }],
    },

    // Bracket notation
    {
      code: "var a = {['b']: 2, ['a']: 1}",
      output: "var a = {['a']: 1, ['b']: 2}",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "var a = {[2]: 'b', [1]: 'a'}",
      output: "var a = {[1]: 'a', [2]: 'b'}",
      errors: [{ messageId: "unsorted" }],
    },

    // Template literals
    {
      code: "var a = {[`b`]: 2, [`a`]: 1}",
      output: "var a = {[`a`]: 1, [`b`]: 2}",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "var a = {[`a${c}e${g}`]: 2, [`a${b}c${d}`]: 1}",
      output: "var a = {[`a${b}c${d}`]: 1, [`a${c}e${g}`]: 2}",
      errors: [{ messageId: "unsorted" }],
    },
    {
      code: "var a = {[`${a}c${e}g`]: 2, [`${a}b${c}d`]: 1}",
      output: "var a = {[`${a}b${c}d`]: 1, [`${a}c${e}g`]: 2}",
      errors: [{ messageId: "unsorted" }],
    },

    // Nested properties
    {
      code: "var a = {c:4, b:{y:3, x:2}, a:1}",
      // Because RuleTester runs autofixing only once, nested properties don't
      // appear to be fixed even though they will be fixed in real world usage.
      output: "var a = {a:1, b:{y:3, x:2}, c:4}",
      errors: [{ messageId: "unsorted" }, { messageId: "unsorted" }],
    },

    // Comments
    {
      code: `
        var a = {
          // d
          d: 2,
          // c
          c: 1,
          ...spread1,
          e: 3,
          // spread 2
          ...spread2,
          b: 5,
          a: 4
        }
      `.trim(),
      output: `
        var a = {
          // c
          c: 1,
          // d
          d: 2,
          ...spread1,
          e: 3,
          // spread 2
          ...spread2,
          a: 4,
          b: 5
        }
      `.trim(),
      errors: [{ messageId: "unsorted" }, { messageId: "unsorted" }],
    },
  ],
})

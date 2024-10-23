import parser from "@typescript-eslint/parser"
import { it, describe } from "vitest"
import { RuleTester, Linter } from "eslint"

RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

globalThis.resolver = (source) => {
  return (
    source.startsWith("dependency-") ||
    source === "../../relative-from-node-modules.js"
  )
}

export function createValidCodeVariants(
  code: string
): RuleTester.ValidTestCase[] {
  return [
    { code, options: [{ caseSensitive: false, natural: false }] },
    { code, options: [{ caseSensitive: true, natural: false }] },
    { code, options: [{ caseSensitive: false, natural: true }] },
    { code, options: [{ caseSensitive: true, natural: true }] },
  ]
}

export function createRuleTester(config?: Linter.Config) {
  return new RuleTester({
    ...config,
    languageOptions: {
      ...config?.languageOptions,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        ...config?.languageOptions?.parserOptions,
      },
    },
  })
}

export function createTsRuleTester(config?: Linter.Config) {
  return new RuleTester({
    ...config,
    languageOptions: {
      ...config?.languageOptions,
      parser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        ...config?.languageOptions?.parserOptions,
      },
    },
  })
}

import { ESLintUtils } from "@typescript-eslint/experimental-utils"
import { RuleTester } from "eslint"
import { it, describe } from "vitest"

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

export function createRuleTester(
  config: unknown = {
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
    },
  }
) {
  const tester = RuleTester as any
  tester.describe = describe
  tester.it = it
  tester.itOnly = it.only

  return new RuleTester(config)
}

export function createTsRuleTester(
  config?: Partial<ConstructorParameters<typeof ESLintUtils.RuleTester>[0]>
) {
  ESLintUtils.RuleTester.describe = describe
  ESLintUtils.RuleTester.it = it
  ESLintUtils.RuleTester.itOnly = it.only

  return new ESLintUtils.RuleTester({
    parser: "@typescript-eslint/parser",
    ...config,
  })
}

import { RuleTester } from "eslint"

export const createValidCodeVariants = (
  code: string
): RuleTester.ValidTestCase[] => {
  return [
    { code, options: [{ caseSensitive: false, natural: false }] },
    { code, options: [{ caseSensitive: true, natural: false }] },
    { code, options: [{ caseSensitive: false, natural: true }] },
    { code, options: [{ caseSensitive: true, natural: true }] },
  ]
}

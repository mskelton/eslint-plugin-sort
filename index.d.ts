import { Linter, Rule } from "eslint"

declare const plugin: {
  configs: {
    recommended: Linter.Config
    ["flat/recommended"]: Linter.FlatConfig
  }
  rules: Record<string, Rule.RuleModule>
}

export default plugin

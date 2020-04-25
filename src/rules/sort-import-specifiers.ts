import { Rule } from "eslint"
import { ImportSpecifier } from "estree"

function sort(node: ImportSpecifier, context: Rule.RuleContext) {}

export default {
  create(context) {
    return {
      ImportSpecifier(node) {
        sort(node as ImportSpecifier, context)
      },
    }
  },
  meta: {
    fixable: "code",
    messages: {
      unsorted: "Expected '{{a}}' to be before '{{b}}'.",
      unsortedSpecifiers: "Expected imported variables to be sorted.",
    },
  },
} as Rule.RuleModule

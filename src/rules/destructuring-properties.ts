import { Rule } from "eslint"
import {
  alphaSorter,
  docsURL,
  enumerate,
  filterNodes,
  getName,
  getNodeRange,
  getNodeText,
  isUnsorted,
} from "../utils"

export default {
  create(context) {
    return {
      ObjectPattern(pattern) {
        const nodes = filterNodes(pattern.properties, ["Property"])

        // If there are one or fewer properties, there is nothing to sort
        if (nodes.length < 2) {
          return
        }

        const sorted = nodes
          .slice()
          .sort(alphaSorter((node) => getName(node.key).toLowerCase()))

        if (isUnsorted(nodes, sorted)) {
          const source = context.getSourceCode()

          context.report({
            node: nodes[0],
            messageId: "unsorted",
            *fix(fixer) {
              for (const [node, complement] of enumerate(nodes, sorted)) {
                yield fixer.replaceTextRange(
                  getNodeRange(source, node),
                  getNodeText(source, complement)
                )
              }
            },
          })
        }
      },
    }
  },
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      url: docsURL("destructuring-properties"),
    },
    messages: {
      unsorted: "Destructuring properties should be sorted alphabetically.",
    },
  },
} as Rule.RuleModule

import { Rule } from "eslint"
import {
  alphaSorter,
  enumerate,
  filterNodes,
  getNodeRange,
  getNodeText,
  isUnsorted,
} from "../utils"

export default {
  create(context) {
    return {
      ImportDeclaration(decl) {
        const nodes = filterNodes(decl.specifiers, "ImportSpecifier")

        // If there are one or fewer properties, there is nothing to sort.
        if (nodes.length < 2) {
          return
        }

        const complements = nodes
          .slice()
          .sort(alphaSorter((node) => node.imported.name.toLowerCase()))

        if (isUnsorted(nodes, complements)) {
          const source = context.getSourceCode()

          context.report({
            node: nodes[0],
            messageId: "unsorted",
            *fix(fixer) {
              for (const [node, complement] of enumerate(nodes, complements)) {
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
    messages: {
      unsorted: "Import members should be sorted alphabetically.",
    },
  },
} as Rule.RuleModule

import { Rule } from "eslint"
import {
  alphaSorter,
  docsURL,
  enumerate,
  getNodeRange,
  getNodeText,
  isUnsorted,
} from "../utils"

export default {
  create(context) {
    const source = context.getSourceCode()

    return {
      ExportNamedDeclaration({ specifiers: nodes }) {
        // If there are one or fewer properties, there is nothing to sort
        if (nodes.length < 2) {
          return
        }

        const sorted = nodes
          .slice()
          .sort(alphaSorter((node) => node.local.name.toLowerCase()))

        if (isUnsorted(nodes, sorted)) {
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
      url: docsURL("export-members"),
    },
    messages: {
      unsorted: "Export members should be sorted alphabetically.",
    },
  },
} as Rule.RuleModule

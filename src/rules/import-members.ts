import { Rule } from "eslint"
import {
  alphaSorter,
  docsURL,
  enumerate,
  filterNodes,
  getNodeRange,
  getNodeText,
  isUnsorted,
} from "../utils"

export default {
  create(context) {
    const source = context.getSourceCode()

    return {
      ImportDeclaration(decl) {
        const nodes = filterNodes(decl.specifiers, ["ImportSpecifier"])

        // If there are one or fewer properties, there is nothing to sort
        if (nodes.length < 2) {
          return
        }

        const sorted = nodes
          .slice()
          .sort(alphaSorter((node) => node.imported.name.toLowerCase()))

        const firstUnsortedNode = isUnsorted(nodes, sorted)
        if (firstUnsortedNode) {
          context.report({
            node: firstUnsortedNode,
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
      url: docsURL("import-members"),
    },
    messages: {
      unsorted: "Import members should be sorted alphabetically.",
    },
  },
} as Rule.RuleModule

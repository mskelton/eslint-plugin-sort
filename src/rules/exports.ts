import { Rule } from "eslint"
import { ImportDeclaration, ModuleDeclaration } from "estree"
import {
  docsURL,
  enumerate,
  filterNodes,
  getName,
  getNodeRange,
  getNodeText,
  isUnsorted,
} from "../utils"

type Export = Exclude<ModuleDeclaration, ImportDeclaration>

/**
 * Returns the node's sort weight. The sort weight is used to separate types
 * of nodes into groups and then sort in each individual group.
 */
function getWeight(node: Export) {
  return node.type === "ExportDefaultDeclaration" ? 2 : node.source ? 0 : 1
}

function getSortValue(node: Export) {
  return node.type !== "ExportDefaultDeclaration" && node.source
    ? getName(node.source)
    : ""
}

export default {
  create(context) {
    const source = context.getSourceCode()

    return {
      Program(program) {
        const nodes = filterNodes(program.body, [
          "ExportNamedDeclaration",
          "ExportAllDeclaration",
          "ExportDefaultDeclaration",
        ])

        // If there are one or fewer exports, there is nothing to sort
        if (nodes.length < 2) {
          return
        }

        const sorted = nodes.slice().sort(
          (a, b) =>
            // First sort by weight
            getWeight(a) - getWeight(b) ||
            // Then sort by path
            getSortValue(a).localeCompare(getSortValue(b))
        )

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
      url: docsURL("exports"),
    },
    messages: {
      unsorted: "Exports should be sorted alphabetically.",
    },
  },
} as Rule.RuleModule

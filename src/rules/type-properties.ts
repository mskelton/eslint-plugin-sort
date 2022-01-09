import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree,
} from "@typescript-eslint/experimental-utils"
import { getName, getNodeRange, getNodeText, isDelimiter } from "../ts-utils"
import { docsURL, enumerate, isUnsorted } from "../utils"

/**
 * Returns the node's sort weight. The sort weight is used to separate types
 * of nodes into groups and then sort in each individual group.
 */
function getWeight(node: TSESTree.TypeElement) {
  const weights = {
    [AST_NODE_TYPES.TSConstructSignatureDeclaration]: 0,
    [AST_NODE_TYPES.TSCallSignatureDeclaration]: 1,
    [AST_NODE_TYPES.TSPropertySignature]: 2,
    [AST_NODE_TYPES.TSMethodSignature]: 2,
    [AST_NODE_TYPES.TSIndexSignature]: 3,
  }

  return weights[node.type]
}

function getSortValue(node: TSESTree.TypeElement) {
  switch (node.type) {
    case AST_NODE_TYPES.TSPropertySignature:
    case AST_NODE_TYPES.TSMethodSignature:
      return getName(node.key)

    case AST_NODE_TYPES.TSIndexSignature:
      return getName(node.parameters[0])
  }

  return ""
}

export default ESLintUtils.RuleCreator.withoutDocs({
  create(context) {
    const source = context.getSourceCode()

    function getRangeWithoutDelimiter(node: TSESTree.Node): TSESTree.Range {
      const range = getNodeRange(source, node)

      return isDelimiter(source.getLastToken(node))
        ? [range[0], range[1] - 1]
        : range
    }

    function sort(nodes: TSESTree.TypeElement[]) {
      // If there are one or fewer properties, there is nothing to sort
      if (nodes.length < 2) {
        return
      }

      const sorted = nodes.slice().sort(
        (a, b) =>
          // First sort by weight
          getWeight(a) - getWeight(b) ||
          // Then sort by name
          getSortValue(a).localeCompare(getSortValue(b))
      )

      if (isUnsorted(nodes, sorted)) {
        context.report({
          node: nodes[0],
          messageId: "unsorted",
          *fix(fixer) {
            for (const [node, complement] of enumerate(nodes, sorted)) {
              yield fixer.replaceTextRange(
                getRangeWithoutDelimiter(node),
                getNodeText(source, complement).replace(/[;,]$/, "")
              )
            }
          },
        })
      }
    }

    return {
      TSInterfaceBody(node) {
        sort(node.body)
      },
      TSTypeLiteral(node) {
        sort(node.members)
      },
    }
  },
  meta: {
    fixable: "code",
    docs: {
      recommended: false,
      url: docsURL("type-properties"),
      description: `Sorts TypeScript type properties alphabetically and case insensitive in ascending order.`,
    },
    messages: {
      unsorted: "Type properties should be sorted alphabetically.",
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
})

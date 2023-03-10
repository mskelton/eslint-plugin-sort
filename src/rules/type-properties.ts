import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree,
} from "@typescript-eslint/experimental-utils"
import { getName, getNodeRange, getNodeText, isDelimiter } from "../ts-utils"
import { docsURL, enumerate, getSorter, isUnsorted } from "../utils"

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

export default ESLintUtils.RuleCreator.withoutDocs<
  [{ caseSensitive?: boolean; natural?: boolean }],
  "unsorted"
>({
  create(context) {
    const source = context.getSourceCode()
    const options = context.options[0]
    const sorter = getSorter({
      caseSensitive: options?.caseSensitive,
      natural: options?.natural,
    })

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
          sorter(getSortValue(a), getSortValue(b))
      )

      const firstUnsortedNode = isUnsorted(nodes, sorted)
      if (firstUnsortedNode) {
        context.report({
          node: firstUnsortedNode,
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
    docs: {
      recommended: false,
      url: docsURL("type-properties"),
      description: `Sorts TypeScript type properties alphabetically and case insensitive in ascending order.`,
    },
    fixable: "code",
    messages: {
      unsorted: "Type properties should be sorted alphabetically.",
    },
    schema: [
      {
        type: "object",
        properties: {
          caseSensitive: {
            type: "boolean",
            default: false,
          },
          natural: {
            type: "boolean",
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    type: "suggestion",
  },
  defaultOptions: [{}],
})

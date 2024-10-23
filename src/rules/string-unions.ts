import {
  ESLintUtils,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils"
import { getNodeText } from "../ts-utils.js"
import { docsURL, enumerate, getSorter, isUnsorted } from "../utils.js"

function getSortValue(node: TSESTree.Node) {
  return node.type === TSESTree.AST_NODE_TYPES.TSLiteralType &&
    node.literal.type === TSESTree.AST_NODE_TYPES.Literal &&
    typeof node.literal.value === "string"
    ? node.literal.value
    : null
}

export default ESLintUtils.RuleCreator.withoutDocs<
  [{ caseSensitive?: boolean; natural?: boolean }],
  "unsorted"
>({
  create(context) {
    const source = context.getSourceCode()
    const options = context.options[0]
    const sorter = getSorter(options)

    return {
      TSUnionType(node) {
        const nodes = node.types

        // If there are one or fewer properties, there is nothing to sort
        if (nodes.length < 2) return

        // Ignore mixed type unions
        if (nodes.map(getSortValue).some((value) => value === null)) return

        const sorted = nodes
          .slice()
          .sort((a, b) => sorter(getSortValue(a) ?? "", getSortValue(b) ?? ""))

        const firstUnsortedNode = isUnsorted(nodes, sorted)
        if (firstUnsortedNode) {
          context.report({
            node: firstUnsortedNode,
            messageId: "unsorted",
            *fix(fixer) {
              for (const [node, complement] of enumerate(nodes, sorted)) {
                yield fixer.replaceText(node, getNodeText(source, complement))
              }
            },
          })
        }
      },
    }
  },
  meta: {
    docs: {
      recommended: false,
      url: docsURL("string-unions"),
      description: `Sorts TypeScript string unions alphabetically and case insensitive in ascending order.`,
    },
    fixable: "code",
    messages: {
      unsorted: "String unions should be sorted alphabetically.",
    },
    schema: [
      {
        additionalProperties: false,
        default: { caseSensitive: false, natural: true },
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
        type: "object",
      },
    ],
    type: "suggestion",
  },
  defaultOptions: [{}],
}) as TSESLint.RuleModule<string, unknown[]>

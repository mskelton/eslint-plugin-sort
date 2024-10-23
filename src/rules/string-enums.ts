import { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils"
import { getNodeText } from "../ts-utils.js"
import { docsURL, enumerate, getSorter, isUnsorted } from "../utils.js"

function getSortValue(node: TSESTree.TSEnumMember) {
  return node.initializer?.type === TSESTree.AST_NODE_TYPES.Literal &&
    typeof node.initializer.value === "string"
    ? node.initializer.value
    : null
}

export default ESLintUtils.RuleCreator.withoutDocs<
  [{ caseSensitive?: boolean; natural?: boolean }],
  "unsorted"
>({
  create(context) {
    const options = context.options[0]
    const sorter = getSorter(options)

    return {
      TSEnumDeclaration(node) {
        const nodes = node.body.members ?? node.members

        // If there are one or fewer properties, there is nothing to sort
        if (nodes.length < 2) return

        // Ignore mixed type enums
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
                yield fixer.replaceText(
                  node,
                  getNodeText(context.sourceCode, complement)
                )
              }
            },
          })
        }
      },
    }
  },
  meta: {
    docs: {
      url: docsURL("string-enums"),
      description: `Sorts TypeScript string enums alphabetically and case insensitive in ascending order.`,
    },
    fixable: "code",
    messages: {
      unsorted: "String enums should be sorted alphabetically.",
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

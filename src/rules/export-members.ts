import { Rule } from "eslint"
import { docsURL, getSorter, report } from "../utils.js"

export default {
  create(context) {
    const options = context.options[0]
    const sorter = getSorter({
      caseSensitive: options?.caseSensitive,
      natural: options?.natural,
    })

    return {
      ExportNamedDeclaration({ specifiers: nodes }) {
        // If there are one or fewer properties, there is nothing to sort
        if (nodes.length < 2) {
          return
        }

        const sorted = nodes
          .slice()
          .sort((nodeA, nodeB) => sorter(nodeA.local.name, nodeB.local.name))

        report(context, nodes, sorted)
      },
    }
  },
  meta: {
    docs: {
      url: docsURL("export-members"),
    },
    fixable: "code",
    messages: {
      unsorted: "Export members should be sorted alphabetically.",
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
} as Rule.RuleModule

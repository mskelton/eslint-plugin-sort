import { Rule } from "eslint"
import { docsURL, filterNodes, getSorter, report } from "../utils.js"

export default {
  create(context) {
    const options = context.options[0]
    const sorter = getSorter(options)

    return {
      ImportDeclaration(decl) {
        const nodes = filterNodes(decl.specifiers, ["ImportSpecifier"])

        // If there are one or fewer properties, there is nothing to sort
        if (nodes.length < 2) {
          return
        }

        const sorted = nodes
          .slice()
          .sort((nodeA, nodeB) =>
            sorter(nodeA.imported.name, nodeB.imported.name)
          )

        report(context, nodes, sorted)
      },
    }
  },
  meta: {
    docs: {
      url: docsURL("import-members"),
    },
    fixable: "code",
    messages: {
      unsorted: "Import members should be sorted alphabetically.",
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

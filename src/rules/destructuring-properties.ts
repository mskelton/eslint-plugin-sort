import { Rule } from "eslint"
import { docsURL, filterNodes, getName, getSorter, report } from "../utils.js"

export default {
  create(context) {
    const options = context.options[0]
    const sorter = getSorter({
      caseSensitive: options?.caseSensitive,
      natural: options?.natural,
    })

    return {
      ObjectPattern(pattern) {
        const nodes = filterNodes(pattern.properties, ["Property"])

        // If there are one or fewer properties, there is nothing to sort
        if (nodes.length < 2) {
          return
        }

        const sorted = nodes
          .slice()
          .sort((nodeA, nodeB) =>
            sorter(getName(nodeA.key), getName(nodeB.key))
          )

        report(context, nodes, sorted)
      },
    }
  },
  meta: {
    docs: {
      url: docsURL("destructuring-properties"),
    },
    fixable: "code",
    messages: {
      unsorted: "Destructuring properties should be sorted alphabetically.",
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

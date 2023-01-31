import { Rule } from "eslint"
import { alphaSorter, docsURL, filterNodes, getName, report } from "../utils.js"

export default {
  create(context) {
    return {
      ObjectPattern(pattern) {
        const nodes = filterNodes(pattern.properties, ["Property"])

        // If there are one or fewer properties, there is nothing to sort
        if (nodes.length < 2) {
          return
        }

        const sorted = nodes
          .slice()
          .sort(alphaSorter((node) => getName(node.key).toLowerCase()))

        report(context, nodes, sorted)
      },
    }
  },
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      url: docsURL("destructuring-properties"),
    },
    messages: {
      unsorted: "Destructuring properties should be sorted alphabetically.",
    },
  },
} as Rule.RuleModule

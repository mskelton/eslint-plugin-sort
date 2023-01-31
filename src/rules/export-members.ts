import { Rule } from "eslint"
import { alphaSorter, docsURL, report } from "../utils.js"

export default {
  create(context) {
    return {
      ExportNamedDeclaration({ specifiers: nodes }) {
        // If there are one or fewer properties, there is nothing to sort
        if (nodes.length < 2) {
          return
        }

        const sorted = nodes
          .slice()
          .sort(alphaSorter((node) => node.local.name.toLowerCase()))

        report(context, nodes, sorted)
      },
    }
  },
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      url: docsURL("export-members"),
    },
    messages: {
      unsorted: "Export members should be sorted alphabetically.",
    },
  },
} as Rule.RuleModule

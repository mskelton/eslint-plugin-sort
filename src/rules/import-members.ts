import { Rule } from "eslint"
import { alphaSorter, docsURL, filterNodes, report } from "../utils.js"

export default {
  create(context) {
    return {
      ImportDeclaration(decl) {
        const nodes = filterNodes(decl.specifiers, ["ImportSpecifier"])

        // If there are one or fewer properties, there is nothing to sort
        if (nodes.length < 2) {
          return
        }

        const sorted = nodes
          .slice()
          .sort(alphaSorter((node) => node.imported.name.toLowerCase()))

        report(context, nodes, sorted)
      },
    }
  },
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      url: docsURL("import-members"),
    },
    messages: {
      unsorted: "Import members should be sorted alphabetically.",
    },
  },
} as Rule.RuleModule

import { Rule } from "eslint"
import { ImportDeclaration } from "estree"
import { isResolved } from "../resolver"
import {
  docsURL,
  enumerate,
  filterNodes,
  getName,
  getNodeRange,
  getNodeText,
  isUnsorted,
} from "../utils"

interface SortGroup {
  order: number
  type?: "dependency" | "side-effect" | "other"
  regex?: string
}

/**
 * Returns the order of a given node based on the sort groups configured in the
 * rule options. If no sort groups are configured (default), the order returned
 * is always 0.
 */
function getSortGroup(sortGroups: SortGroup[], node: ImportDeclaration) {
  const source = getName(node.source)

  for (const { regex, type, order } of sortGroups) {
    switch (type) {
      case "side-effect":
        if (!node.specifiers.length) return order
        break

      case "dependency":
        if (isResolved(source)) return order
        break

      case "other":
        return order
    }

    if (regex && new RegExp(regex).test(source)) {
      return order
    }
  }

  return 0
}

const getSortValue = (node: ImportDeclaration) =>
  getName(node.source).toLowerCase()

export default {
  create(context) {
    const groups = context.options[0]?.groups ?? []

    return {
      Program(program) {
        const nodes = filterNodes(program.body, "ImportDeclaration")

        // If there are one or fewer imports, there is nothing to sort
        if (nodes.length < 2) {
          return
        }

        const sorted = nodes.slice().sort(
          (a, b) =>
            // First sort by sort group
            getSortGroup(groups, a) - getSortGroup(groups, b) ||
            // Then sort by import name
            getSortValue(a).localeCompare(getSortValue(b))
        )

        if (isUnsorted(nodes, sorted)) {
          const source = context.getSourceCode()

          // When sorting, the comments for the first node are not copied as
          // we cannot determine if they are comments for the entire file or
          // just the first import.
          const isFirst = (node: ImportDeclaration) => node === nodes[0]

          context.report({
            node: nodes[0],
            messageId: "unsorted",
            *fix(fixer) {
              for (const [node, complement] of enumerate(nodes, sorted)) {
                yield fixer.replaceTextRange(
                  getNodeRange(source, node, !isFirst(node)),
                  getNodeText(source, complement, !isFirst(complement))
                )
              }
            },
          })
        }
      },
    }
  },
  meta: {
    fixable: "code",
    type: "suggestion",
    docs: {
      url: docsURL("imports"),
    },
    messages: {
      unsorted: "Imports should be sorted.",
    },
    schema: [
      {
        type: "object",
        properties: {
          groups: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { enum: ["side-effect", "dependency", "other"] },
                regex: { type: "string" },
                order: { type: "number" },
              },
              required: ["order"],
              additionalProperties: false,
            },
          },
        },
      },
    ],
  },
} as Rule.RuleModule

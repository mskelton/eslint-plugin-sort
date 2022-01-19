import { ExportDefaultDeclaration } from "@typescript-eslint/types/dist/ast-spec"
import { Rule } from "eslint"
import { ImportDeclaration, ModuleDeclaration } from "estree"
import { isResolved } from "../resolver"
import { docsURL, filterNodes, getName, report } from "../utils"

type Export = Exclude<ModuleDeclaration, ImportDeclaration>

interface SortGroup {
  order: number
  type?: "default" | "sourceless" | "dependency" | "other"
  regex?: string
}

/**
 * Returns the order of a given node based on the sort groups configured in the
 * rule options. If no sort groups are configured (default), the order returned
 * is always 0.
 */
function getSortGroup(
  sortGroups: SortGroup[],
  node: Exclude<Export, ExportDefaultDeclaration>
) {
  const source = getSortValue(node)
  const isDefaultExport = node.type === "ExportDefaultDeclaration"

  for (const { regex, type, order } of sortGroups) {
    switch (type) {
      case "default":
        if (isDefaultExport) return order
        break

      case "sourceless":
        if (!isDefaultExport && !node.source) return order
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

function getSortValue(node: Export) {
  return node.type !== "ExportDefaultDeclaration" && node.source
    ? getName(node.source)
    : ""
}

export default {
  create(context) {
    const groups = context.options[0]?.groups ?? []

    return {
      Program(program) {
        const nodes = filterNodes(program.body, [
          "ExportNamedDeclaration",
          "ExportAllDeclaration",
          "ExportDefaultDeclaration",
        ])

        // If there are one or fewer exports, there is nothing to sort
        if (nodes.length < 2) {
          return
        }

        const sorted = nodes.slice().sort(
          (a, b) =>
            // First, sort by sort group
            getSortGroup(groups, a) - getSortGroup(groups, b) ||
            // Then sort by path
            getSortValue(a).localeCompare(getSortValue(b))
        )

        report(context, nodes, sorted)
      },
    }
  },
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      url: docsURL("exports"),
    },
    messages: {
      unsorted: "Exports should be sorted alphabetically.",
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
                type: {
                  enum: ["default", "sourceless", "dependency", "other"],
                },
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

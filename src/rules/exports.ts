import { Rule } from "eslint"
import { ImportDeclaration, ModuleDeclaration } from "estree"
import { isResolved } from "../resolver.js"
import {
  docsURL,
  filterNodes,
  getImportOrExportKindWeight,
  getName,
  getSorter,
  ImportOrExportKind,
  report,
  SorterOptions,
  TypeOrder,
} from "../utils.js"

type Export = Exclude<ModuleDeclaration, ImportDeclaration>

const sortGroupsTypes = [
  "default",
  "sourceless",
  "dependency",
  "type",
  "other",
] as const

interface SortGroup {
  order: number
  type?: (typeof sortGroupsTypes)[number]
  regex?: string
}

interface Options extends SorterOptions {
  groups?: SortGroup[]
  separator?: string
  typeOrder?: TypeOrder
}

/**
 * Returns the order of a given node based on the sort groups configured in the
 * rule options. If no sort groups are configured (default), the order returned
 * is always 0.
 */
function getSortGroup(sortGroups: SortGroup[], node: Export) {
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

      case "type": {
        const { exportKind } = node as { exportKind?: string }
        if (exportKind === "type") return order
        break
      }

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

function getExportKindWeight(options: Options | undefined, node: Export) {
  const typeOrder = options?.typeOrder ?? "preserve"
  const kind = (node as { exportKind?: ImportOrExportKind }).exportKind

  return getImportOrExportKindWeight(typeOrder, kind)
}

function getSortValue(node: Export) {
  return node.type !== "ExportDefaultDeclaration" && node.source
    ? getName(node.source)
    : ""
}

export default {
  create(context) {
    const options = context.options[0] as Options | undefined
    const groups = options?.groups ?? []
    const sorter = getSorter(options)

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
            // First sort by sort group
            getSortGroup(groups, a) - getSortGroup(groups, b) ||
            // Then sort by export name
            sorter(getSortValue(a), getSortValue(b)) ||
            // Finally sort by export kind
            getExportKindWeight(options, a) - getExportKindWeight(options, b)
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
                  enum: sortGroupsTypes,
                },
                regex: {
                  type: "string",
                },
                order: {
                  type: "number",
                },
              },
              required: ["order"],
              additionalProperties: false,
            },
          },
          typeOrder: {
            enum: ["preserve", "first", "last"],
            default: "preserve",
          },
          caseSensitive: {
            type: "boolean",
            default: false,
          },
          natural: {
            type: "boolean",
            default: true,
          },
        },
      },
    ],
  },
} as Rule.RuleModule

import { Rule, AST } from "eslint"
import { ImportDeclaration } from "estree"
import { isResolved } from "../resolver.js"
import {
  docsURL,
  enumerate,
  filterNodes,
  getImportOrExportKindWeight,
  getName,
  getNodeRange,
  getNodeText,
  getSorter,
  ImportOrExportKind,
  isUnsorted,
  pluralize,
  range,
  SorterOptions,
  TypeOrder,
} from "../utils.js"

interface SortGroup {
  order: number
  type?: "dependency" | "side-effect" | "other"
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

function getImportKindWeight(
  options: Options | undefined,
  node: ImportDeclaration
) {
  const typeOrder = options?.typeOrder ?? "preserve"
  const kind = (node as { importKind?: ImportOrExportKind }).importKind

  return getImportOrExportKindWeight(typeOrder, kind)
}

const getSortValue = (node: ImportDeclaration) => getName(node.source)

const rawString = (str: string) =>
  JSON.stringify(str).slice(1, -1).replace(/\\n/g, "\\n")

export default {
  create(context) {
    const options = context.options[0] as Options | undefined
    const groups = options?.groups ?? []
    const separator = options?.separator ?? ""
    const sorter = getSorter(options)
    const source = context.getSourceCode()

    return {
      Program(program) {
        const nodes = filterNodes(program.body, ["ImportDeclaration"])

        // If there are one or fewer imports, there is nothing to sort
        if (nodes.length < 2) {
          return
        }

        const sorted = nodes.slice().sort(
          (a, b) =>
            // First sort by sort group
            getSortGroup(groups, a) - getSortGroup(groups, b) ||
            // Then sort by import name
            sorter(getSortValue(a), getSortValue(b)) ||
            // Finally sort by import kind
            getImportKindWeight(options, a) - getImportKindWeight(options, b)
        )

        const firstUnsortedNode = isUnsorted(nodes, sorted)
        if (firstUnsortedNode) {
          // When sorting, the comments for the first node are not copied as
          // we cannot determine if they are comments for the entire file or
          // just the first import.
          const isFirst = (node: ImportDeclaration) => node === nodes[0]

          context.report({
            node: firstUnsortedNode,
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

        const text = source.getText()
        for (let i = 1; i < nodes.length; i++) {
          const node = nodes[i]
          const prevNode = nodes[i - 1]

          // If the node has preceding comments, we want to use the first
          // comment as the starting position for both determining what the
          // current separator is as well as the location for the report.
          const nodeOrComment = source.getCommentsBefore(node)[0] ?? node

          // Find the range between nodes (including comments) so we can pull
          // the text and apply fixes to newlines between imports.
          const rangeBetween: AST.Range = [
            range.end(prevNode),
            range.start(nodeOrComment),
          ]

          // To make the separator option make more sense, we always assume a
          // single newline will be present between imports. This means that
          // we have to remove the first newline before determining if the
          // current separator matches the configured separator.
          // We also remove all non-newline spaces to make the comparison
          // stable even if there is extra spaces before imports.
          const actualSeparator = text
            .slice(...rangeBetween)
            .replace(/[^\n]/g, "") // Remove all non-newline characters
            .replace("\n", "") // Remove the first newline

          // To make the errors more readable, we want to report the location
          // of the newline between the imports, rather than the imports
          // themselves. When there is no existing space between, we add the
          // message to the second import since it makes more sense that it
          // wasn't spaced far enough from the first one (reading order top down).
          const startLine = (prevNode.loc?.end.line ?? 0) + 1
          const endLine = (nodeOrComment.loc?.start.line ?? 0) - 1
          const loc: AST.SourceLocation = {
            start: { line: startLine, column: 0 },
            end: { line: Math.max(endLine, startLine), column: 0 },
          }

          const isSameGroup =
            getSortGroup(groups, sorted[i - 1]) ===
            getSortGroup(groups, sorted[i])

          // For imports in the same group, we don't care about the configured
          // separator, there should only ever be a single newline.
          if (isSameGroup || separator === "") {
            if (actualSeparator !== "") {
              context.report({
                messageId: "extraNewlines",
                loc,
                data: {
                  newlines: pluralize("newline", actualSeparator.length),
                },
                fix: (fixer) => fixer.replaceTextRange(rangeBetween, "\n"),
              })
            }
          } else if (separator !== "" && actualSeparator === "") {
            context.report({
              messageId: "missingSeparator",
              loc,
              data: { expected: rawString(separator) },
              fix: (fixer) => fixer.insertTextAfter(prevNode, separator),
            })
          } else if (separator !== actualSeparator) {
            context.report({
              messageId: "incorrectSeparator",
              loc,
              data: {
                actual: rawString(actualSeparator),
                expected: rawString(separator),
              },
              fix: (fixer) =>
                fixer.replaceTextRange(rangeBetween, separator + "\n"),
            })
          }
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
      incorrectSeparator:
        "Expected `{{expected}}` to separate import groups but found `{{actual}}`.",
      extraNewlines: "Unexpected {{newlines}} between imports.",
      missingSeparator: "Missing `{{expected}}` between import groups.",
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
                type: {
                  enum: ["side-effect", "dependency", "other"],
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
          separator: {
            type: "string",
            default: "",
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

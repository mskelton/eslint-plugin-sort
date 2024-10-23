import { Rule, AST } from "eslint"
import { TSESTree } from "@typescript-eslint/utils"
import * as ESTree from "estree"
import { isResolved } from "../resolver.js"
import * as tsUtils from "../ts-utils.js"
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

const sortGroupsTypes = ["side-effect", "dependency", "type", "other"] as const

type Import = ESTree.ImportDeclaration | TSESTree.TSImportEqualsDeclaration

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

const getSortValue = (node: Import) =>
  node.type === "ImportDeclaration"
    ? getName(node.source)
    : tsUtils.getName(node.moduleReference)

/**
 * Returns the order of a given node based on the sort groups configured in the
 * rule options. If no sort groups are configured (default), the order returned
 * is always 0.
 */
function getSortGroup(sortGroups: SortGroup[], node: Import) {
  const source = getSortValue(node)

  for (const { regex, type, order } of sortGroups) {
    switch (type) {
      case "side-effect":
        if (node.type === "ImportDeclaration" && !node.specifiers.length) {
          return order
        }
        break

      case "type": {
        const { importKind } = node as { importKind?: string }
        if (importKind === "type") return order
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

function getImportKindWeight(options: Options | undefined, node: Import) {
  const typeOrder = options?.typeOrder ?? "preserve"
  const kind = (node as { importKind?: ImportOrExportKind }).importKind

  return getImportOrExportKindWeight(typeOrder, kind)
}

const rawString = (str: string) =>
  JSON.stringify(str).slice(1, -1).replace(/\\n/g, "\\n")

export default {
  create(context) {
    const options = context.options[0] as Options | undefined
    const groups = options?.groups ?? []
    const separator = options?.separator ?? ""
    const sorter = getSorter(options)

    return {
      Program(program) {
        const nodes = filterNodes(program.body, [
          "ImportDeclaration",
          "TSImportEqualsDeclaration" as "ImportDeclaration",
        ])

        // If there are one or fewer imports, there is nothing to sort
        if (nodes.length < 2) {
          return
        }

        // Ensure there is no code between imports. If there is, we'll bail
        // out and not try to sort. Ideally we would move the code after the
        // imports but it's not worth the complexity for such a niche case.
        //
        // Checking for this case is pretty simple, we just check if the
        // distance between the first and last import is the same as the
        // total number of import nodes.
        const startNodeIndex = program.body.indexOf(nodes[0])
        const endNodeIndex = program.body.indexOf(nodes.at(-1)!)
        if (endNodeIndex - startNodeIndex !== nodes.length - 1) {
          return context.report({
            node: program,
            messageId: "codeBetweenImports",
          })
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
          const isFirst = (node: ESTree.Node) => node === nodes[0]

          context.report({
            node: firstUnsortedNode,
            messageId: "unsorted",
            *fix(fixer) {
              for (const [node, complement] of enumerate(nodes, sorted)) {
                yield fixer.replaceTextRange(
                  getNodeRange(context.sourceCode, node, !isFirst(node)),
                  getNodeText(
                    context.sourceCode,
                    complement,
                    !isFirst(complement)
                  )
                )
              }
            },
          })
        }

        const text = context.sourceCode.getText()
        for (let i = 1; i < nodes.length; i++) {
          const node = nodes[i]
          const prevNode = nodes[i - 1]

          // If the node has preceding comments, we want to use the first
          // comment as the starting position for both determining what the
          // current separator is as well as the location for the report.
          const nodeOrComment =
            context.sourceCode.getCommentsBefore(node)[0] ?? node

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
      codeBetweenImports:
        "Unexpected code between imports. Sorting will be skipped.",
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

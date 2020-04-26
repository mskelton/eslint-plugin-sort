import { Rule, SourceCode } from "eslint"
import {
  Directive,
  ImportDeclaration,
  ModuleDeclaration,
  Program,
  Statement,
} from "estree"
import { isResolved } from "../resolver"
import { getSortValue, getTextRange, getTextWithComments } from "../utils"

type Options = {
  groups: SortGroup[]
  separator: string
}

export type SortGroup = {
  order: number
  type?: "dependency" | "side-effect" | "other"
  regex?: string
}

const isImport = (
  node: Directive | Statement | ModuleDeclaration
): node is ImportDeclaration => node.type === "ImportDeclaration"

function getSortGroup(sortGroups: SortGroup[], node: ImportDeclaration) {
  const source = getSortValue(node.source)

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

  return Infinity
}

type GroupedNode = {
  node: ImportDeclaration
  group: number
}

function sortFn(a: GroupedNode, b: GroupedNode) {
  if (a.group > b.group) return 1
  if (a.group < b.group) return -1

  const aText = getSortValue(a.node.source)
  const bText = getSortValue(b.node.source)

  if (aText > bText) return 1
  if (aText < bText) return -1

  return 0
}

const getText = (source: SourceCode, node: ImportDeclaration) =>
  source.getText().slice(...getTextRange(node, node))

const mapSortGroups = (sortGroups: SortGroup[]) => (
  node: ImportDeclaration
) => ({
  node,
  group: getSortGroup(sortGroups, node),
})

function autofix(
  context: Rule.RuleContext,
  imports: ImportDeclaration[],
  lastUnsortedNode: ImportDeclaration,
  options: Options
) {
  const source = context.getSourceCode()

  context.report({
    node: lastUnsortedNode,
    messageId: "unsortedImports",
    fix(fixer) {
      const text = imports
        .map(mapSortGroups(options.groups))
        .sort(sortFn)
        .reduce((acc, { node, group }, index, arr) => {
          // If the current import was the first import before sorting, don't
          // move the comments as we don't know if they are for the import or
          // the file header comments.
          const text =
            node === imports[0]
              ? getText(source, node)
              : getTextWithComments(source, node)

          // When the next sort group begins, add the separator. If it is the
          // first sort group, don't add the separator.
          const previousGroup = arr[index - 1]
          const separator =
            previousGroup && previousGroup.group !== group
              ? options.separator
              : ""

          return (
            acc +
            separator +
            text +
            // All imports except the last should be separated by a single
            // newline. This has no affect on the separator.
            (index < arr.length - 1 ? "\n" : "")
          )
        }, "")

      return fixer.replaceTextRange(
        getTextRange(imports[0], imports[imports.length - 1]),
        text
      )
    },
  })
}

function sort(
  imports: ImportDeclaration[],
  context: Rule.RuleContext,
  options: Options
) {
  let lastUnsortedNode: ImportDeclaration | null = null

  // If there are less than two imports, there is nothing to sort.
  if (imports.length < 2) {
    return
  }

  imports.map(mapSortGroups(options.groups)).reduce((previous, current) => {
    if (sortFn(current, previous) < 0) {
      context.report({
        node: current.node,
        messageId: "unsorted",
        data: {
          a: getSortValue(current.node.source),
          b: getSortValue(previous.node.source),
        },
      })

      lastUnsortedNode = current.node
    }

    return current
  })

  // If we fixed each set of unsorted imports, it would require multiple runs to
  // fix if there are multiple unsorted imports. Instead, we add a add special
  // error with an autofix rule which will sort all imports at once.
  if (lastUnsortedNode) {
    autofix(context, imports, lastUnsortedNode, options)
  }
}

export default {
  create(context) {
    return {
      Program(node) {
        const options = {
          groups: [],
          separator: "\n",
          ...context.options[0],
        }

        sort((node as Program).body.filter(isImport), context, options)
      },
    }
  },
  meta: {
    fixable: "code",
    messages: {
      unsorted: "Expected '{{a}}' to be before '{{b}}'.",
      unsortedImports: "Expected imports to be sorted.",
    },
    schema: [
      {
        type: "object",
        properties: {
          groups: { type: "array" },
          separator: { type: "string" },
        },
      },
    ],
  },
} as Rule.RuleModule

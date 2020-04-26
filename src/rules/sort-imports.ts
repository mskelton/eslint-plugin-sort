import { Rule, SourceCode } from "eslint"
import {
  Directive,
  ImportDeclaration,
  ModuleDeclaration,
  Program,
  Statement,
} from "estree"
import {
  getSortValue,
  getTextBetweenNodes,
  getTextRange,
  getTextWithComments,
} from "../utils"
import { isResolved } from "../resolver"

export type SortGroup = {
  order: number
  type?: "external" | "side-effect" | "other"
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

      case "external":
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

const getSortFn = (sortGroups: SortGroup[]) => (
  a: ImportDeclaration,
  b: ImportDeclaration
) => {
  const aSortGroup = getSortGroup(sortGroups, a)
  const bSortGroup = getSortGroup(sortGroups, b)

  if (aSortGroup > bSortGroup) return 1
  if (aSortGroup < bSortGroup) return -1

  const aText = getSortValue(a.source)
  const bText = getSortValue(b.source)

  if (aText > bText) return 1
  if (aText < bText) return -1

  return 0
}

const getText = (source: SourceCode, node: ImportDeclaration) =>
  source.getText().slice(...getTextRange(node, node))

function autofix(
  context: Rule.RuleContext,
  imports: ImportDeclaration[],
  lastUnsortedNode: ImportDeclaration,
  sortGroups: SortGroup[]
) {
  const source = context.getSourceCode()

  context.report({
    node: lastUnsortedNode,
    messageId: "unsortedImports",
    fix(fixer) {
      const text = imports
        .slice()
        .sort(getSortFn(sortGroups))
        .reduce((acc, node, index) => {
          // If the current import was the first import before sorting, don't
          // move the comments as we don't know if they are for the import or
          // the file header comments.
          const text =
            node === imports[0]
              ? getText(source, node)
              : getTextWithComments(source, node)

          return (
            acc +
            text +
            getTextBetweenNodes(source, imports[index], imports[index + 1])
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
  sortGroups: SortGroup[]
) {
  let lastUnsortedNode: ImportDeclaration | null = null

  // If there are less than two imports, there is nothing to sort.
  if (imports.length < 2) {
    return
  }

  const sortFn = getSortFn(sortGroups)

  imports.reduce((previousNode, currentNode) => {
    console.log(sortFn(currentNode, previousNode))
    if (sortFn(currentNode, previousNode) < 0) {
      context.report({
        node: currentNode,
        messageId: "unsorted",
        data: {
          a: getSortValue(currentNode.source),
          b: getSortValue(previousNode.source),
        },
      })

      lastUnsortedNode = currentNode
    }

    return currentNode
  })

  // If we fixed each set of unsorted imports, it would require multiple runs to
  // fix if there are multiple unsorted imports. Instead, we add a add special
  // error with an autofix rule which will sort all imports at once.
  if (lastUnsortedNode) {
    autofix(context, imports, lastUnsortedNode, sortGroups)
  }
}

export default {
  create(context) {
    return {
      Program(node) {
        sort(
          (node as Program).body.filter(isImport),
          context,
          context.options[0] || []
        )
      },
    }
  },
  meta: {
    fixable: "code",
    messages: {
      unsorted: "Expected '{{a}}' to be before '{{b}}'.",
      unsortedImports: "Expected imports to be sorted.",
    },
    schema: [{ type: "array" }],
  },
} as Rule.RuleModule

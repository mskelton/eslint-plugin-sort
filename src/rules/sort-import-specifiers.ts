import { Rule } from "eslint"
import {
  ImportDeclaration,
  ImportSpecifier,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
} from "estree"
import {
  getSorter,
  getTextWithComments,
  getNodeGroupRange,
  getTextBetweenNodes,
} from "./utils"

function getNodeText(node: ImportSpecifier) {
  return node.imported.name
}

const getNodeSortValue = (node: ImportSpecifier) =>
  getNodeText(node).toLowerCase()

const isImportSpecifier = (
  node: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
): node is ImportSpecifier => node.type === "ImportSpecifier"

function autofix(context: Rule.RuleContext, node: ImportDeclaration) {
  const source = context.getSourceCode()

  context.report({
    node,
    messageId: "unsortedSpecifiers",
    fix(fixer) {
      const text = node.specifiers
        .filter(isImportSpecifier)
        .sort(getSorter(getNodeSortValue))
        .reduce((acc, currentNode, index) => {
          return (
            acc +
            getTextWithComments(source, currentNode) +
            getTextBetweenNodes(
              source,
              node.specifiers[index],
              node.specifiers[index + 1]
            )
          )
        }, "")

      return fixer.replaceTextRange(
        getNodeGroupRange(source, node.specifiers),
        text
      )
    },
  })
}

function sort(node: ImportDeclaration, context: Rule.RuleContext) {
  const specifiers = node.specifiers.filter(isImportSpecifier)

  // If there are less than two specifiers, there is nothing to sort.
  if (specifiers.length < 2) {
    return
  }

  let lastUnsortedNode: ImportSpecifier | null = null

  specifiers.reduce((previousNode, currentNode) => {
    if (getNodeSortValue(currentNode) < getNodeSortValue(previousNode)) {
      context.report({
        node: currentNode,
        messageId: "unsorted",
        data: {
          a: getNodeText(currentNode),
          b: getNodeText(previousNode),
        },
      })

      lastUnsortedNode = currentNode
    }

    return currentNode
  })

  // If we fixed each set of unsorted nodes, it would require multiple runs to
  // fix if there are multiple unsorted nodes. Instead, we add a add special
  // error with an autofix rule which will sort all specifiers at once.
  if (lastUnsortedNode) {
    autofix(context, node)
  }
}

export default {
  create(context) {
    return {
      ImportDeclaration(node) {
        sort(node as ImportDeclaration, context)
      },
    }
  },
  meta: {
    fixable: "code",
    messages: {
      unsorted: "Expected '{{a}}' to be before '{{b}}'.",
      unsortedSpecifiers: "Expected imported variables to be sorted.",
    },
  },
} as Rule.RuleModule

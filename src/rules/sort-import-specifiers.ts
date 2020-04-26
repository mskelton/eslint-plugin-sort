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

type Specifier =
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier

const isImportSpecifier = (node: Specifier): node is ImportSpecifier =>
  node.type === "ImportSpecifier"

const getNodeText = (node: ImportSpecifier) => node.imported.name

const sortFn = (node: Specifier) =>
  isImportSpecifier(node) ? getNodeText(node).toLowerCase() : -Infinity

function autofix(context: Rule.RuleContext, node: ImportDeclaration) {
  const source = context.getSourceCode()

  context.report({
    node,
    messageId: "unsortedSpecifiers",
    fix(fixer) {
      const text = node.specifiers
        .slice()
        .sort(getSorter(sortFn))
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
  let unsorted = false

  // If there are less than two specifiers, there is nothing to sort.
  if (specifiers.length < 2) {
    return
  }

  specifiers.reduce((previousNode, currentNode) => {
    if (sortFn(currentNode) < sortFn(previousNode)) {
      context.report({
        node: currentNode,
        messageId: "unsorted",
        data: {
          a: getNodeText(currentNode),
          b: getNodeText(previousNode),
        },
      })

      unsorted = true
    }

    return currentNode
  })

  // If we fixed each set of unsorted nodes, it would require multiple runs to
  // fix if there are multiple unsorted nodes. Instead, we add a add special
  // error with an autofix rule which will sort all specifiers at once.
  if (unsorted) {
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

import { Rule } from "eslint"
import {
  Program,
  Directive,
  Statement,
  ModuleDeclaration,
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
  getSortValue,
} from "./utils"

type Specifier =
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier

const isImport = (
  node: Directive | Statement | ModuleDeclaration
): node is ImportDeclaration => node.type === "ImportDeclaration"

const sortFn = (node: ImportDeclaration) =>
  getSortValue(node.source).toLowerCase()

function autofix(
  context: Rule.RuleContext,
  imports: ImportDeclaration[],
  lastUnsortedNode: ImportDeclaration
) {
  const source = context.getSourceCode()

  context.report({
    node: lastUnsortedNode,
    messageId: "unsortedImports",
    fix(fixer) {
      const text = imports
        .slice()
        .sort(getSorter(sortFn))
        .reduce((acc, currentNode, index) => {
          return (
            acc +
            getTextWithComments(source, currentNode) +
            getTextBetweenNodes(source, imports[index], imports[index + 1])
          )
        }, "")

      return fixer.replaceTextRange(getNodeGroupRange(source, imports), text)
    },
  })
}

function sort(imports: ImportDeclaration[], context: Rule.RuleContext) {
  let lastUnsortedNode: ImportDeclaration | null = null

  // If there are less than two imports, there is nothing to sort.
  if (imports.length < 2) {
    return
  }

  imports.reduce((previousNode, currentNode) => {
    if (sortFn(currentNode) < sortFn(previousNode)) {
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
    autofix(context, imports, lastUnsortedNode)
  }
}

export default {
  create(context) {
    return {
      Program(node) {
        sort((node as Program).body.filter(isImport), context)
      },
    }
  },
  meta: {
    fixable: "code",
    messages: {
      unsorted: "Expected '{{a}}' to be before '{{b}}'.",
      unsortedImports: "Expected imports to be sorted.",
    },
  },
} as Rule.RuleModule

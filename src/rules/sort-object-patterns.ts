import { Rule } from "eslint"
import { AssignmentProperty, ObjectPattern, RestElement } from "estree"
import {
  getNodeGroupRange,
  getSorter,
  getSortValue,
  getTextBetweenNodes,
  getTextWithComments,
  isUnsorted,
} from "./utils"

type Property = AssignmentProperty | RestElement

const sortFn = (node: Property) =>
  node.type === "RestElement" ? Infinity : getSortValue(node.key).toLowerCase()

function autofix(context: Rule.RuleContext, node: ObjectPattern) {
  const source = context.getSourceCode()

  context.report({
    node,
    messageId: "unsortedPattern",
    fix(fixer) {
      const text = node.properties
        .slice()
        .sort(getSorter(sortFn))
        .reduce((acc, currentNode, index) => {
          return (
            acc +
            getTextWithComments(source, currentNode) +
            getTextBetweenNodes(
              source,
              node.properties[index],
              node.properties[index + 1]
            )
          )
        }, "")

      return fixer.replaceTextRange(
        getNodeGroupRange(source, node.properties),
        text
      )
    },
  })
}

const isProperty = (
  node: AssignmentProperty | RestElement
): node is AssignmentProperty => node.type === "Property"

function sort(node: ObjectPattern, context: Rule.RuleContext) {
  const properties = node.properties.filter(isProperty)
  let unsorted = false

  // If there is one or less property, there is nothing to sort.
  if (properties.length < 2) {
    return
  }

  properties.reduce((previousNode, currentNode) => {
    if (isUnsorted(previousNode.key, currentNode.key)) {
      context.report({
        node: currentNode,
        messageId: "unsorted",
        data: {
          a: getSortValue(currentNode.key),
          b: getSortValue(previousNode.key),
        },
      })

      unsorted = true
    }

    return currentNode
  })

  // If we fixed each set of unsorted properties, it would require multiple
  // runs to fix if there are multiple unsorted properties. Instead, we
  // track the last unsorted property and add special error with an autofix
  // rule which will sort the entire object pattern at once.
  if (unsorted) {
    autofix(context, node)
  }
}

export default {
  create(context) {
    return {
      ObjectPattern(node) {
        sort(node as ObjectPattern, context)
      },
    }
  },
  meta: {
    fixable: "code",
    messages: {
      unsorted: "Expected '{{a}}' to be before '{{b}}'.",
      unsortedPattern: "Expected destructured properties to be sorted.",
    },
  },
} as Rule.RuleModule

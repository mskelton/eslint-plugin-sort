import { Rule } from "eslint"
import { ObjectExpression, Property } from "estree"
import {
  getNodeGroupRange,
  getSorter,
  getSortValue,
  getTextBetweenNodes,
  getTextWithComments,
  isUnsorted,
} from "../utils"

/**
 * When sorting object properties, we have to sort the groups of nodes between
 * spread elements since changing the location of the spread elements will
 * affect runtime. This method will split object properties into groups of nodes
 * between spread elements which can then be safely sorted.
 */
function getNodeGroupsBetweenSpreads(node: ObjectExpression) {
  return (
    node.properties
      .reduce(
        (acc, property) => {
          if (property.type === "SpreadElement") {
            acc.push([])
          } else {
            acc[acc.length - 1].push(property)
          }

          return acc
        },
        [[]] as Property[][]
      )
      // We only need to sort when there is more than one property
      .filter((group) => group.length > 1)
  )
}

function autofix(context: Rule.RuleContext, node: ObjectExpression) {
  const source = context.getSourceCode()

  context.report({
    node,
    messageId: "unsortedProperties",
    fix(fixer) {
      return getNodeGroupsBetweenSpreads(node).map((nodes, index) => {
        const text = nodes
          .slice()
          .sort(getSorter((node) => getSortValue(node.key).toLowerCase()))
          .reduce((acc, currentNode, idx, group) => {
            // The last node in the group should not get the text between itself
            // and the next property as the next property is a spread element
            // and is not part of the replaced text range.
            const endIndex = index + (idx < group.length - 1 ? 1 : 0)

            return (
              acc +
              getTextWithComments(source, currentNode) +
              getTextBetweenNodes(
                source,
                node.properties[index],
                node.properties[endIndex]
              )
            )
          }, "")

        return fixer.replaceTextRange(getNodeGroupRange(source, nodes), text)
      })
    },
  })
}

function sort(node: ObjectExpression, context: Rule.RuleContext) {
  let unsorted = false

  getNodeGroupsBetweenSpreads(node).forEach((group) => {
    group.reduce((previousNode, currentNode) => {
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
      ObjectExpression(node) {
        sort(node as ObjectExpression, context)
      },
    }
  },
  meta: {
    fixable: "code",
    messages: {
      unsorted: "Expected '{{a}}' to be before '{{b}}'.",
      unsortedProperties: "Expected object properties to be sorted.",
    },
  },
} as Rule.RuleModule

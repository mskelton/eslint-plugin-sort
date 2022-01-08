import { Rule } from "eslint"
import { Property, SpreadElement } from "estree"
import {
  alphaSorter,
  enumerate,
  getName,
  getNodeRange,
  getNodeText,
  isUnsorted,
} from "../utils"

/**
 * When sorting object properties, we can only sort properties between spread
 * elements as re-arranging spread elements can have runtime side effects.
 *
 * This function will return a 2d array of nodes where each sub-array is a set
 * of consecutive nodes between spread elements that can be sorted.
 */
function groupNodes(properties: (Property | SpreadElement)[]) {
  const groups: Property[][] = [[]]

  properties.forEach((property) => {
    if (property.type === "Property") {
      groups[groups.length - 1].push(property)
    } else {
      groups.push([])
    }
  })

  return groups.filter((group) => group.length > 1)
}

export default {
  create(context) {
    return {
      ObjectExpression(expression) {
        for (const nodes of groupNodes(expression.properties)) {
          const sorted = nodes
            .slice()
            .sort(alphaSorter((node) => getName(node.key).toLowerCase()))

          if (isUnsorted(nodes, sorted)) {
            const source = context.getSourceCode()

            context.report({
              node: nodes[0],
              messageId: "unsorted",
              *fix(fixer) {
                for (const [node, complement] of enumerate(nodes, sorted)) {
                  yield fixer.replaceTextRange(
                    getNodeRange(source, node),
                    getNodeText(source, complement)
                  )
                }
              },
            })
          }
        }
      },
    }
  },
  meta: {
    type: "suggestion",
    fixable: "code",
    messages: {
      unsorted: "Object properties should be sorted alphabetically.",
    },
  },
} as Rule.RuleModule

import { Rule } from "eslint"
import { Property, SpreadElement } from "estree"
import { docsURL, getName, getSorter, report } from "../utils"

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
    const options = context.options[0]
    const sorter = getSorter({
      caseSensitive: options?.caseSensitive,
      natural: options?.natural,
    })

    return {
      ObjectExpression(expression) {
        for (const nodes of groupNodes(expression.properties)) {
          const sorted = nodes
            .slice()
            .sort((nodeA, nodeB) =>
              sorter(getName(nodeA.key), getName(nodeB.key))
            )

          report(context, nodes, sorted)
        }
      },
    }
  },
  meta: {
    docs: {
      url: docsURL("object-properties"),
    },
    fixable: "code",
    messages: {
      unsorted: "Object properties should be sorted alphabetically.",
    },
    schema: [
      {
        type: "object",
        properties: {
          caseSensitive: {
            type: "boolean",
            default: false,
          },
          natural: {
            type: "boolean",
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    type: "suggestion",
  },
} as Rule.RuleModule

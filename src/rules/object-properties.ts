import { Rule } from "eslint"
import { Property, SpreadElement } from "estree"
import { docsURL, getName, report } from "../utils"
import naturalCompare from "natural-compare"

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

/**
 * Functions which check that the given 2 names are in specific order.
 *
 * Postfix `I` is meant insensitive.
 * Postfix `N` is meant natural.
 *
 * Adapted from Eslint's sort-keys rule
 */
const sorters: { [key in string]: (a: string, b: string) => number } = {
  asc(a, b) {
    return a.localeCompare(b)
  },
  ascI(a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase())
  },
  ascN(a, b) {
    return naturalCompare(a, b)
  },
  ascIN(a, b) {
    return naturalCompare(a.toLowerCase(), b.toLowerCase())
  },
  desc(a, b) {
    return sorters.asc(b, a)
  },
  descI(a, b) {
    return sorters.ascI(b, a)
  },
  descN(a, b) {
    return sorters.ascN(b, a)
  },
  descIN(a, b) {
    return sorters.ascIN(b, a)
  },
}

export default {
  create(context) {
    const order = context.options[0] || "asc"
    const options = context.options[1]

    const isCaseInsensitive = options && options.caseSensitive === false
    const isNaturalOrder = options && options.natural

    const sorter =
      sorters[
        `${order}${isCaseInsensitive ? "I" : ""}${isNaturalOrder ? "N" : ""}`
      ]

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
        enum: ["asc", "desc"],
      },
      {
        type: "object",
        properties: {
          caseSensitive: {
            type: "boolean",
            default: false,
          },
          natural: {
            type: "boolean",
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    type: "suggestion",
  },
} as Rule.RuleModule

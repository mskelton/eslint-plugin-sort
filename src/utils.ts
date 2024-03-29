import { AST, Rule, SourceCode } from "eslint"
import { Expression, Identifier, Node, PrivateIdentifier } from "estree"
import naturalCompare from "natural-compare"

/**
 * Returns the first node in the source array that is different from the same
 * positioned node in the sorted array.
 */
export function isUnsorted<T>(nodes: T[], sorted: T[]) {
  return nodes.find((node, i) => node !== sorted[i])
}

/**
 * Enumerates two node arrays and returns only the pairs where
 * the nodes are not equal.
 */
export function enumerate<T>(a: T[], b: T[]) {
  return a
    .map((val, index) => [val, b[index]])
    .filter((x) => x[0] !== x[1]) as [T, T][]
}

/**
 * Get's the string name of a node used for sorting or errors.
 */
export function getName(
  node?: Expression | Identifier | PrivateIdentifier
): string {
  switch (node?.type) {
    case "Identifier":
    case "PrivateIdentifier":
      return node.name

    case "Literal":
      return node.value!.toString()

    // `a${b}c${d}` becomes `abcd`
    case "TemplateLiteral":
      return node.quasis.reduce(
        (acc, quasi, i) => acc + quasi.value.raw + getName(node.expressions[i]),
        ""
      )
  }

  return ""
}

/**
 * Filters an array of nodes to only include those matching the provided type.
 * @param nodes - The array of nodes to filter
 * @param type - Only nodes matching this `type` will be returned
 */
export const filterNodes = <T extends Node, U extends T["type"]>(
  nodes: T[],
  types: U[]
) =>
  nodes.filter((node): node is Extract<T, { type: U }> =>
    types.includes(node.type as U)
  )

export interface SorterOptions {
  caseSensitive?: boolean
  natural?: boolean
}

/**
 * Returns a sort function that can sort strings based on the provided options.
 */
export const getSorter = ({
  caseSensitive = false,
  natural = true,
}: SorterOptions = {}): ((a: string, b: string) => number) => {
  if (caseSensitive && natural) {
    return (a, b) => naturalCompare(a, b)
  } else if (caseSensitive) {
    return (a, b) => (a < b ? -1 : a > b ? 1 : 0)
  } else if (natural) {
    return (a, b) => naturalCompare(a.toLowerCase(), b.toLowerCase())
  }

  return (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
}

/**
 * The `getTextRange` function only requires the `range` property, so with a
 * simple constraint we can share the function for both ESTree and TSESTree.
 */
interface Rangewise {
  range?: [number, number]
}

/**
 * Returns an AST range between two nodes.
 */
export const getTextRange = (left: Rangewise, right: Rangewise): AST.Range => [
  range.start(left),
  range.end(right),
]

/**
 * Returns an AST range for a node and it's preceding comments.
 */
export function getNodeRange(
  source: SourceCode,
  node: Node,
  includeComments = true
) {
  return getTextRange(
    (includeComments && source.getCommentsBefore(node)[0]) || node,
    node
  )
}

/**
 * Returns a node's text with it's preceding comments.
 */
export function getNodeText(
  source: SourceCode,
  node: Node,
  includeComments = true
) {
  return source.getText().slice(...getNodeRange(source, node, includeComments))
}

/**
 * Returns the URL to a rule's documentation.
 */
export const docsURL = (ruleName: string) =>
  `https://github.com/mskelton/eslint-plugin-sort/blob/main/docs/rules/${ruleName}.md`

/**
 * Reports an `unsorted` error if there are one or more unsorted nodes. The
 * error is attached to the first unsorted node to make it more obvious why
 * the error is reported.
 */
export function report(
  context: Rule.RuleContext,
  nodes: Node[],
  sorted: Node[]
) {
  const firstUnsortedNode = isUnsorted(nodes, sorted)

  if (firstUnsortedNode) {
    context.report({
      node: firstUnsortedNode,
      messageId: "unsorted",
      *fix(fixer) {
        for (const [node, complement] of enumerate(nodes, sorted)) {
          yield fixer.replaceTextRange(
            getNodeRange(context.sourceCode, node),
            getNodeText(context.sourceCode, complement)
          )
        }
      },
    })
  }
}

export const range = {
  start: (node: Rangewise) => node.range![0],
  end: (node: Rangewise) => node.range![1],
}

export const pluralize = (word: string, count: number) =>
  word + (count === 1 ? "" : "s")

export type TypeOrder = "preserve" | "first" | "last"
export type ImportOrExportKind = "type" | "value"

/**
 * Returns a weight for the given import/export kind.
 */
export function getImportOrExportKindWeight(
  typeOrder: TypeOrder,
  kind: ImportOrExportKind | undefined
) {
  if (typeOrder === "first") {
    return kind === "type" ? -1 : 1
  }

  if (typeOrder === "last") {
    return kind === "type" ? 1 : -1
  }

  return 0
}

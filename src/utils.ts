import { AST, SourceCode } from "eslint"
import { Comment, Expression, Node } from "estree"

/**
 * Returns true if any node in the source array is different from the same
 * positioned node in the sorted array.
 */
export function isUnsorted(nodes: Node[], sorted: Node[]) {
  return nodes.some((node, i) => node !== sorted[i])
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
export function getName(node?: Expression): string {
  switch (node?.type) {
    case "Identifier":
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
  type: U
) => nodes.filter((node): node is Extract<T, { type: U }> => node.type === type)

/**
 * Function that returns a simple alphanumeric sort function. The return value
 * of this function should be passed to `Array.prototype.sort()`.
 */
export function alphaSorter<T extends Node>(sortFn: (node: T) => string) {
  return (a: T, b: T) => sortFn(a).localeCompare(sortFn(b))
}

/**
 * Returns an AST range between two nodes.
 */
export const getTextRange = (
  left: Node | Comment,
  right: Node | Comment
): AST.Range => [left.range![0], right.range![1]]

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

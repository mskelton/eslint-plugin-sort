import { AST, SourceCode } from "eslint"
import { AssignmentProperty, Comment, Node, RestElement } from "estree"

type Property = AssignmentProperty | RestElement

export function getSorter(sortFn: (node: Property) => string | number) {
  return (a: Property, b: Property) => {
    const aText = sortFn(a)
    const bText = sortFn(b)

    if (aText === Infinity) return 1
    if (aText === -Infinity) return -1

    if (aText < bText) return -1
    if (aText > bText) return 1

    return 0
  }
}

const getTextRange = (
  left: Node | Comment,
  right: Node | Comment
): AST.Range => [left.range![0], right.range![1]]

export function getTextWithComments(source: SourceCode, node: Node) {
  return source
    .getText()
    .slice(...getTextRange(source.getCommentsBefore(node)[0] || node, node))
}

export const getTextBetweenNodes = (
  source: SourceCode,
  left: Node,
  right: Node
) => {
  const nextComments = right ? source.getCommentsBefore(right) : []
  const nextNodeStart = nextComments[0] || right

  const text = source
    .getText()
    .slice(
      left.range![1],
      nextNodeStart ? nextNodeStart.range![0] : left.range![1]
    )

  return text
}

export function getNodeGroupRange(source: SourceCode, nodes: Node[]) {
  return getTextRange(
    source.getCommentsBefore(nodes[0])[0] || nodes[0],
    nodes[nodes.length - 1]
  )
}

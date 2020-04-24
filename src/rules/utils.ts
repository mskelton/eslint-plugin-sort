import { AST, SourceCode } from "eslint";
import { AssignmentProperty, Node, RestElement } from "estree";

type Property = AssignmentProperty | RestElement;

export function getSorter(sortFn: (node: Property) => string | number) {
  return (a: Property, b: Property) => {
    const aText = sortFn(a);
    const bText = sortFn(b);

    if (aText === Infinity) return 1;
    if (aText === -Infinity) return -1;

    if (aText < bText) return -1;
    if (aText > bText) return 1;

    return 0;
  };
}

export const getTextBetweenNodes = (
  source: SourceCode,
  start: Node,
  end: Node
) => (end ? source.getText().slice(start.range![1], end.range![0]) : "");

export function getNodeGroupRange(nodes: Node[]): AST.Range {
  return [nodes[0].range![0], nodes[nodes.length - 1].range![1]];
}

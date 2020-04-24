import { Rule } from "eslint";
import ESTree from "estree";

function getNodeText(node: ESTree.AssignmentProperty) {
  return node.value.name;
}

function sort(node: ESTree.ObjectPattern, context: Rule.RuleContext) {
  let lastUnsortedNode: ESTree.AssignmentProperty | null = null;

  node.properties.reduce((previousNode, currentNode) => {
    // Rest elements must always be the last node. As such, we skip the rest
    // elements if they are the current node as we will process them when
    // they are the previous node.
    if (currentNode.type === "RestElement") {
      return currentNode;
    }

    // If the rest element is the previous node, it was not placed at the end of
    // the destructuring pattern. Fortunately, we can autofix this mistake.
    if (previousNode.type === "RestElement") {
      console.log("bad");
      return currentNode;
    }

    const previousText = getNodeText(previousNode);
    const currentText = getNodeText(currentNode);

    if (currentText.toLowerCase() < previousText.toLowerCase()) {
      context.report({
        node: currentNode,
        messageId: "unsorted",
        data: {
          a: currentText,
          b: previousText,
        },
      });

      lastUnsortedNode = currentNode;
    }

    return currentNode;
  });

  // If we fixed each set of unsorted properties, it would require multiple
  // runs to fix if there are multiple unsorted properties. Instead, we
  // track the last unsorted property and add special error with an autofix
  // rule which will sort the entire object pattern at once.
  if (lastUnsortedNode) {
    context.report({
      node: lastUnsortedNode,
      messageId: "unsortedPattern",
    });
  }
}

export default {
  create(context) {
    return {
      ObjectPattern(node) {
        return sort(node as ESTree.ObjectPattern, context);
      },
    };
  },
  meta: {
    messages: {
      unsorted: "Expected '{{a}}' to be before '{{b}}'.",
      unsortedPattern: "Expected destructured properties to be sorted.",
      invalidRest: "Expected rest element to be the last property.",
    },
  },
} as Rule.RuleModule;

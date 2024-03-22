import {
  AST_NODE_TYPES,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/experimental-utils"
import { getTextRange } from "./utils.js"

/**
 * Get's the string name of a node used for sorting or errors.
 */
export function getName(node?: TSESTree.Node): string {
  switch (node?.type) {
    case AST_NODE_TYPES.TSExternalModuleReference:
      return getName(node.expression)

    case AST_NODE_TYPES.Identifier:
      return node.name

    case AST_NODE_TYPES.Literal:
      return node.value!.toString()

    // `a${b}c${d}` becomes `abcd`
    case AST_NODE_TYPES.TemplateLiteral:
      return node.quasis.reduce(
        (acc, quasi, i) => acc + quasi.value.raw + getName(node.expressions[i]),
        ""
      )
  }

  return ""
}

/**
 * Returns an AST range for a node and it's preceding comments.
 */
export function getNodeRange(source: TSESLint.SourceCode, node: TSESTree.Node) {
  return getTextRange(source.getCommentsBefore(node)[0] ?? node, node)
}

/**
 * Returns a node's text with it's preceding comments.
 */
export function getNodeText(source: TSESLint.SourceCode, node: TSESTree.Node) {
  return source.getText().slice(...getNodeRange(source, node))
}

/**
 * Returns true if the token is a delimiter (comma or semicolon).
 */
export const isDelimiter = (token: TSESTree.Token | null) =>
  token?.type === "Punctuator" && (token.value === "," || token.value === ";")

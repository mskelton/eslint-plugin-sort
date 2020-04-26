import sortImports from "./rules/sort-imports"
import sortImportSpecifiers from "./rules/sort-import-specifiers"
import sortObjectPatterns from "./rules/sort-object-patterns"
import sortObjectProperties from "./rules/sort-object-properties"

module.exports = {
  configs: {
    recommended: {
      plugins: ["sort"],
      rules: {
        "sort/destructured-properties": "warn",
        "sort/imported-variables": "warn",
        "sort/imports": [
          "warn",
          [
            { type: "side-effect", order: 1 },
            { type: "external", order: 2 },
            { regex: "^\\.+\\/", order: 4 },
            { type: "other", order: 3 },
          ],
        ],
        "sort/object-properties": "warn",
      },
    },
  },
  rules: {
    "destructured-properties": sortObjectPatterns,
    "imported-variables": sortImportSpecifiers,
    imports: sortImports,
    "object-properties": sortObjectProperties,
  },
}

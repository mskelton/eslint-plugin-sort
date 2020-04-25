import sortImports from "./rules/sort-imports"
import sortImportSpecifiers from "./rules/sort-imports"
import sortObjectPatterns from "./rules/sort-object-patterns"
import sortObjectProperties from "./rules/sort-object-properties"

module.exports = {
  configs: {
    recommended: {
      plugins: ["sort"],
      rules: {
        "sort/imports": "warn",
        "sort/imported-variables": "warn",
        "sort/destructured-properties": "warn",
        "sort/object-properties": "warn",
      },
    },
  },
  rules: {
    "sort/imports": sortImports,
    "sort/imported-variables": sortImportSpecifiers,
    "sort/destructured-properties": sortObjectPatterns,
    "sort/object-properties": sortObjectProperties,
  },
}

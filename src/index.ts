import sortImports from "./rules/sort-imports"
import sortImportSpecifiers from "./rules/sort-import-specifiers"
import sortObjectPatterns from "./rules/sort-object-patterns"
import sortObjectProperties from "./rules/sort-object-properties"

module.exports = {
  configs: {
    recommended: {
      plugins: ["sort"],
      rules: {
        "sort/destructuring-properties": "warn",
        "sort/import-members": "warn",
        "sort/imports": [
          "warn",
          {
            groups: [
              { type: "side-effect", order: 1 },
              {
                name: "relative",
                regex: "^\\.+\\/",
                order: 4,
              },
              { type: "dependency", order: 2 },
              { type: "other", order: 3 },
            ],
            separator: "",
          },
        ],
        "sort/object-properties": "warn",
      },
    },
  },
  rules: {
    "destructuring-properties": sortObjectPatterns,
    "import-members": sortImportSpecifiers,
    "imports": sortImports,
    "object-properties": sortObjectProperties,
  },
}

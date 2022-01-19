import sortDestructuringProperties from "./rules/destructuring-properties"
import sortExports from "./rules/exports"
import sortExportMembers from "./rules/export-members"
import sortImports from "./rules/imports"
import sortImportMembers from "./rules/import-members"
import sortObjectProperties from "./rules/object-properties"
import sortTypeProperties from "./rules/type-properties"

module.exports = {
  configs: {
    recommended: {
      plugins: ["sort"],
      rules: {
        "sort/destructuring-properties": "warn",
        "sort/exports": [
          "warn",
          {
            groups: [
              { type: "default", order: 5 },
              { type: "sourceless", order: 4 },
              { regex: "^\\.+\\/", order: 3 },
              { type: "dependency", order: 1 },
              { type: "other", order: 2 },
            ],
          },
        ],
        "sort/export-members": "warn",
        "sort/imports": [
          "warn",
          {
            groups: [
              { type: "side-effect", order: 1 },
              { regex: "^\\.+\\/", order: 4 },
              { type: "dependency", order: 2 },
              { type: "other", order: 3 },
            ],
          },
        ],
        "sort/import-members": "warn",
        "sort/object-properties": "warn",
      },
    },
  },
  rules: {
    "destructuring-properties": sortDestructuringProperties,
    "exports": sortExports,
    "export-members": sortExportMembers,
    "imports": sortImports,
    "import-members": sortImportMembers,
    "object-properties": sortObjectProperties,
    "type-properties": sortTypeProperties,
  },
}

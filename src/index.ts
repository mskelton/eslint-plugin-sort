import sortDestructuringProperties from "./rules/destructuring-properties"
import sortExports from "./rules/exports"
import sortImportMembers from "./rules/import-members"
import sortImports from "./rules/imports"
import sortObjectProperties from "./rules/object-properties"
import sortTypeProperties from "./rules/type-properties"

module.exports = {
  configs: {
    recommended: {
      plugins: ["sort"],
      rules: {
        "sort/destructuring-properties": "warn",
        "sort/exports": "warn",
        "sort/import-members": "warn",
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
        "sort/object-properties": "warn",
      },
    },
  },
  rules: {
    "destructuring-properties": sortDestructuringProperties,
    "exports": sortExports,
    "import-members": sortImportMembers,
    "imports": sortImports,
    "object-properties": sortObjectProperties,
    "type-properties": sortTypeProperties,
  },
}

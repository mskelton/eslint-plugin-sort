import sortDestructuringProperties from "./rules/destructuring-properties.js"
import sortExports from "./rules/exports.js"
import sortExportMembers from "./rules/export-members.js"
import sortImports from "./rules/imports.js"
import sortImportMembers from "./rules/import-members.js"
import sortObjectProperties from "./rules/object-properties.js"
import sortTypeProperties from "./rules/type-properties.js"
import sortStringUnions from "./rules/string-unions.js"

const config = {
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
    "string-unions": sortStringUnions,
  },
}

export default config as unknown

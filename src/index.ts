import sortDestructuringProperties from "./rules/destructuring-properties.js"
import sortExports from "./rules/exports.js"
import sortExportMembers from "./rules/export-members.js"
import sortImports from "./rules/imports.js"
import sortImportMembers from "./rules/import-members.js"
import sortObjectProperties from "./rules/object-properties.js"
import sortTypeProperties from "./rules/type-properties.js"
import sortStringUnions from "./rules/string-unions.js"
import sortStringEnums from "./rules/string-enums.js"

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
              { type: "default", order: 50 },
              { type: "sourceless", order: 40 },
              { regex: "^\\.+\\/", order: 30 },
              { type: "dependency", order: 10 },
              { type: "other", order: 20 },
            ],
          },
        ],
        "sort/export-members": "warn",
        "sort/imports": [
          "warn",
          {
            groups: [
              { type: "side-effect", order: 10 },
              { regex: "^\\.+\\/", order: 40 },
              { type: "dependency", order: 20 },
              { type: "other", order: 30 },
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
    "string-enums": sortStringEnums,
  },
}

export default config as unknown

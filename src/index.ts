import imports from "./rules/imports"
import importMembers from "./rules/import-members"
import destructuringProperties from "./rules/destructuring-properties"
import objectProperties from "./rules/object-properties"
import typeProperties from "./rules/type-properties"

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
    "destructuring-properties": destructuringProperties,
    "import-members": importMembers,
    "imports": imports,
    "object-properties": objectProperties,
    "type-properties": typeProperties,
  },
}

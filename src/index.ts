import sortImports from "./rules/sort-imports";
import sortObjectProperties from "./rules/sort-object-properties";
import sortObjectPatterns from "./rules/sort-object-patterns";

module.exports = {
  configs: {
    recommended: {
      plugins: ["sort"],
      rules: {
        "sort/imports": "warn",
        "sort/object-patterns": "warn",
        "sort/object-properties": "warn",
      },
    },
  },
  rules: {
    "sort/imports": sortImports,
    "sort/object-patterns": sortObjectPatterns,
    "sort/object-properties": sortObjectProperties,
  },
};

import sortImports from "./rules/sort-imports";
import sortObjectProperties from "./rules/sort-object-properties";
import sortObjectPatterns from "./rules/sort-object-patterns";

module.exports = {
  configs: {
    recommended: {
      plugins: ["sort"],
      rules: {
        "sort/imports": ["warn", { fix: true }],
        "sort/object-patterns": ["warn", { fix: true }],
        "sort/object-properties": ["warn", { fix: true }],
      },
    },
  },
  rules: {
    "sort/imports": sortImports,
    "sort/object-patterns": sortObjectPatterns,
    "sort/object-properties": sortObjectProperties,
  },
};

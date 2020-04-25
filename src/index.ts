import sortImports from "./rules/sort-imports";
import sortObjectProperties from "./rules/sort-object-properties";
import sortObjectPatterns from "./rules/sort-destructured-properties";

module.exports = {
  configs: {
    recommended: {
      plugins: ["sort"],
      rules: {
        "sort/imports": "warn",
        "sort/destructured-properties": "warn",
        "sort/object-properties": "warn",
      },
    },
  },
  rules: {
    "sort/imports": sortImports,
    "sort/destructured-properties": sortObjectPatterns,
    "sort/object-properties": sortObjectProperties,
  },
};

export default {
  testRegex: "/__tests__/.*\\.spec.[jt]s$",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        isolatedModules: true,
        useESM: true,
        diagnostics: {
          ignoreCodes: ["TS151001"],
        },
      },
    ],
  },
}

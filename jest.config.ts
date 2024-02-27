/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest",
  /**
   * use 'transform' to avoid warning
   * (WARN) Define `ts-jest` config under `globals` is deprecated.
   * transform: {
   * <transform_regex>: ['ts-jest', { // ts-jest config goes here in Jest }]
   */
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        isolatedModules: true,
      },
    ],
  },
}

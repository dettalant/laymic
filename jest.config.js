module.exports = {
  verbose: true,
  transform: {
    ".*\\.(ts)$": "ts-jest",
  },
  moduleFileExtensions: ["js", "ts"],
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    "^#/(.+)": "<rootDir>/src/$1"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?|jsx?)$"
}

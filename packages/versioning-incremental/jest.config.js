module.exports = {
  "roots": [
    "<rootDir>"
  ],
  "setupFilesAfterEnv": [
    "<rootDir>/__tests__/setup.js"
  ],
  "testRegex": ".?(test|spec)\\.js$",
  "moduleFileExtensions": [
    "js",
    "jsx",
    "json",
    "node"
  ],
  coverageReporters: ['lcov', 'clover']
};
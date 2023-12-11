const thresholdPercentage = 80;

/** @type {import('jest').Config} */
module.exports = {
  transform: {
    "^.+\\.js?$": ["@swc/jest"],
  },
  testEnvironment: "node",
  testMatch: ["<rootDir>/test/**/?(*.)test.js"],
  coverageThreshold: {
    global: {
      functions: thresholdPercentage,
      lines: thresholdPercentage,
      statements: thresholdPercentage,
    },
  },
  resetMocks: true,
};

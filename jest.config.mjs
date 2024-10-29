const thresholdPercentage = 80;

/** @type {import('jest').Config} */
export default {
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

module.exports = {
  transform: {
    "^.+\\.js?$": ["@swc/jest"],
  },
  testEnvironment: "node",
  testMatch: ["<rootDir>/test/**/*"],
};

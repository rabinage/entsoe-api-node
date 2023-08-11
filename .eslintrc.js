/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  parserOptions: {
    ecmaVersion: "latest",
  },
  env: {
    node: true,
    "jest/globals": true,
    es2021: true,
  },
  ignorePatterns: "dist/**",
  plugins: ["prettier", "import", "jest"],
  extends: ["airbnb-base", "eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    "prettier/prettier": "warn",
    "import/no-unresolved": "error",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
      },
    ],
  },
};

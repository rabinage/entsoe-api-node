const configPrettier = require("eslint-config-prettier/flat");
const eslint = require("@eslint/js");
const pluginPrettier = require("eslint-plugin-prettier/recommended");
const pluginJest = require("eslint-plugin-jest");
const globals = require("globals");

/** @type { import("eslint").Linter.Config[] } */
module.exports = [
  eslint.configs.recommended,
  pluginPrettier,
  configPrettier,
  {
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaVersion: "latest" },
      globals: {
        ...pluginJest.environments.globals.globals,
        ...globals.node,
      },
    },
    ignores: ["dist/**"],
    rules: {
      "prettier/prettier": "warn",
    },
  },
];

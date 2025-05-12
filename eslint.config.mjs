import configPrettier from "eslint-config-prettier/flat";
import eslint from "@eslint/js";
import globals from "globals";
import pluginPrettier from "eslint-plugin-prettier/recommended";

/** @type { import("eslint").Linter.Config[] } */
const config = [
  eslint.configs.recommended,
  pluginPrettier,
  configPrettier,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaVersion: "latest" },
      globals: {
        ...globals.node,
      },
    },
    ignores: ["dist"],
    rules: {
      "prettier/prettier": "warn",
    },
  },
];

export default config;

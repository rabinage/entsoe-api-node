import configPrettier from "eslint-config-prettier";
import js from "@eslint/js";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginNode from "eslint-plugin-n";

/** @type { import("eslint").Linter.Config[] } */
export default [
  js.configs.recommended,
  pluginNode.configs["flat/recommended-module"],
  configPrettier,
  pluginPrettierRecommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaVersion: "latest",
      },
    },
    settings: { node: { version: ">=14.0.0" } },
    ignores: ["dist/**"],
    rules: {
      "prettier/prettier": "warn",
    },
  },
  { files: ["test/**"], settings: { node: { version: ">=22.0.0" } } },
];

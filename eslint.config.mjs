import configPrettier from "eslint-config-prettier";
import globals from "globals";
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
      globals: {
        ...globals.node,
      },
    },
    settings: {
      node: {
        version: ">=20.0.0",
      },
    },
    ignores: ["dist/**"],
    rules: {
      "prettier/prettier": "warn",
      "n/no-extraneous-import": [
        "off",
        {
          allowModules: ["globals"],
        },
      ],
    },
  },
];

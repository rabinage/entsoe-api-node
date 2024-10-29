import configPrettier from "eslint-config-prettier";
import globals from "globals";
import js from "@eslint/js";
import pluginJest from "eslint-plugin-jest";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginNode from "eslint-plugin-n";

/** @type { import("eslint").Linter.Config[] } */
export default [
  js.configs.recommended,
  pluginNode.configs["flat/recommended-script"],
  {
    files: ["**/*.test.js"],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
  },
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
      allowModules: ["globals"],
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

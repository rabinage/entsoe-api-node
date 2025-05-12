import configPrettier from "eslint-config-prettier/flat";
import eslint from "@eslint/js";
import globals from "globals";
import pluginPrettier from "eslint-plugin-prettier/recommended";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist/"]),
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
    rules: {
      "prettier/prettier": "warn",
    },
  },
]);

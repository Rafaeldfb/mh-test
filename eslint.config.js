import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores(["**/node_modules/**", "dist/**", "coverage/**"]),
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    extends: [js.configs.recommended],
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },
  {
    files: ["src/**/*.{js,jsx,ts,tsx,mts,cts}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
  {
    files: ["src/**/*.{jsx,tsx}"],
    extends: [reactRefresh.configs.vite()],
  },
  {
    files: ["server/**/*.ts", "*.config.{js,ts}", "src/**/*.test.{ts,tsx}"],
    languageOptions: { globals: globals.node },
  },
);

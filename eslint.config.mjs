import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended", ...tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
    ignores: ["node_modules/", "dist/", "build/", "**/src/tests/**", "temp/"],
    rules: {
      // 1. Aspas Duplas: Garante o uso de aspas duplas para strings
      quotes: ["error", "double"],

      // 2. 'any' apenas como Warning (aviso)
      "@typescript-eslint/no-explicit-any": "warn",

      // 3. Regra para variáveis não usadas
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
]);

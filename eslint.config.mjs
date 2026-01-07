import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import unusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  // Next.js presets
  ...nextVitals,
  ...nextTs,

  // Global ignores (override Next defaults)
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  // Custom rules
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "unused-imports/no-unused-imports": "error",
    },
  },
]);

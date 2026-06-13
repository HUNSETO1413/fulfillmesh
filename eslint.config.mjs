import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Throwaway root dev/screenshot tooling — not part of the app build.
    "_inspect.mjs",
    "_crop.mjs",
    "_shot.mjs",
    "_shotall.mjs",
    "pixel-diff.mjs",
    "pixel-diff-normalized.mjs",
    "pixel-diff-atf.mjs",
    "screenshot-all.mjs",
    "screenshot-matched.mjs",
  ]),
]);

export default eslintConfig;

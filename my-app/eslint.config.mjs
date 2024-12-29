import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Extend the base configuration with Next.js and TypeScript rules
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": "off",

      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;

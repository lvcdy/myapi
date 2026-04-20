import prettierPlugin from "eslint-plugin-prettier";

const nodeGlobals = {
  process: "readonly",
  console: "readonly",
  Buffer: "readonly",
  URL: "readonly",
  setInterval: "readonly",
  clearTimeout: "readonly",
  setTimeout: "readonly",
  fetch: "readonly",
  Request: "readonly",
  Response: "readonly",
  Headers: "readonly",
  AbortController: "readonly",
  performance: "readonly",
};

const vitestGlobals = {
  ...nodeGlobals,
  describe: "readonly",
  it: "readonly",
  expect: "readonly",
  beforeEach: "readonly",
  vi: "readonly",
};

export default [
  {
    ignores: ["node_modules/**", "coverage/**", "dist/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: nodeGlobals,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "error",
      "no-undef": "error",
      "prettier/prettier": "error",
    },
  },
  {
    files: ["src/__tests__/**/*.js", "vitest.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: vitestGlobals,
    },
  },
];

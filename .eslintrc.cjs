module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
    "prettier"
  ],
  plugins: [
    "@typescript-eslint"
  ],
  parser: "@typescript-eslint/parser",
  rules: {
    // Add any project-specific ESLint rules here
    // For example:
    // "@typescript-eslint/explicit-function-return-type": "warn"
  }
}; 
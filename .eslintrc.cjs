/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@figma/figma-plugins/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './widget-src/tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['dist/**'],
};

/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': ['*.js'],
    }],
    'no-param-reassign': ['error', {
      'props': true,
      'ignorePropertyModificationsFor': ['acc'],
    }],
    'max-len': ['error', {
      'code': 100,
      'ignorePattern': 'd=\"([\\s\\S]*?)\"',
    }],
  },
  ignorePatterns: ['vite.config.ts', '.eslintrc.cjs'],
};

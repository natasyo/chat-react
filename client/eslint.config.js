// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['dist', 'node_modules'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
    },

    plugins: {
      react, // ✅ плагин как объект
      prettier, // ✅ так же плагин как объект
    },

    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...prettierConfig.rules,

      // кастомные правила
      'react/react-in-jsx-scope': 'off', // не нужен в React 17+
      'prettier/prettier': 'error',
    },
  },
];

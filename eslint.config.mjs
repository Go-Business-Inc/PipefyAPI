// ESLint 9 flat config. Replaces the deprecated .eslintrc.json, keeping the same
// intent: eslint:recommended + typescript-eslint recommended, unused vars as
// errors and explicit `any` as a warning.
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Build output and dependencies are never linted.
  { ignores: ['dist/**', 'node_modules/**'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      // TypeScript's own checker handles undefined identifiers.
      'no-undef': 'off',
      // Superseded by the typescript-eslint version, which understands types.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      // The library leans on `any` in a lot of API responses; flag it without
      // failing the build.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Must stay last: turns off every stylistic rule that would fight Prettier.
  prettierConfig,
);

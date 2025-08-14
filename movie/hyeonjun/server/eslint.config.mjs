// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier'; // ✅ Prettier 충돌 비활성화

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'webpack-hmr.config.js'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended, // TypeScript 기본 권장 규칙
  eslintConfigPrettier, // ✅ Prettier와 충돌나는 규칙 비활성화
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: false, // true면 타입 기반 규칙 활성 (느리고 시끄러움)
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
);

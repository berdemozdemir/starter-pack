import { defineConfig, globalIgnores } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import localRules from 'eslint-plugin-local-rules';
import unusedImports from 'eslint-plugin-unused-imports';

/**
 * @see https://nextjs.org/docs/app/api-reference/config/eslint
 */

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  {
    plugins: {
      '@stylistic': stylistic,
      'local-rules': localRules,
      'unused-imports': unusedImports,
    },

    rules: {
      '@stylistic/arrow-parens': 'warn',
      '@stylistic/template-curly-spacing': ['warn', 'never'],
      '@stylistic/rest-spread-spacing': 'warn',

      eqeqeq: 'warn',
      'prefer-const': 'warn',
      'prefer-template': 'warn',
      'object-shorthand': ['warn', 'always'],

      'import/newline-after-import': [
        'warn',
        {
          count: 1,
        },
      ],

      'no-useless-rename': 'warn',
      'no-unneeded-ternary': 'warn',
      'no-template-curly-in-string': 'warn',
      'unused-imports/no-unused-imports': 'warn',

      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'react-hooks/set-state-in-effect': 'off',

      'local-rules/suffix-zod-schemas': 'warn',
    },
  },
  globalIgnores([
    '**/node_modules/**',
    '**/.next/**',
    '**/.vercel/**',
    '**/dist/**',
    '**/out/**',
    '**/build/**',
    '**/coverage/**',
    '**/*.log',
    '**/*.sql',
    '**/*.tsbuildinfo',
    'next-env.d.ts',
    '**/playwright-report/**',
  ]),
]);

import globals from 'globals';
import pluginJs from '@eslint/js';
import daStyle from 'eslint-config-dicodingacademy';

/** @type {import('eslint').Linter.Config[]} */
export default [
  daStyle,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs'
    },
    rules: {
      'no-console': ['off'],
      'import/no-extraneous-dependencies': ['off'],
      'no-unused-vars': 'off',
      'quotes': 'off',
      'no-param-reassign': 'off',
      'no-underscore-dangle': 'off',
      'max-len': 'off',
      'consistent-return': 'off',
      'camelcase': 'off',
      'no-useless-escape': 'off'
    }
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
];
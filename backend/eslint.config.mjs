import globals from 'globals'
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

const defaultConfig = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
    plugins: {},
    rules: {
      eqeqeq: 'error',
    },
  },
  {
    ignores: ['dist/**'],
  },
]

export default [defaultConfig, eslintConfigPrettier]

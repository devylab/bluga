module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // '@typescript-eslint/naming-convention': [
    //   2,
    //   {
    //     selector: 'variable',
    //     format: ['snake_case', 'PascalCase', 'camelCase'],
    //   },
    // ],
    'prettier/prettier': [2, {}, { usePrettierrc: true }],
    'no-useless-escape': 2,
    'no-script-url': 2,
    'no-template-curly-in-string': 2,
    'linebreak-style': 2,
    'no-use-before-define': 2,
    'no-param-reassign': 2,
    'no-console': 2,
    'no-return-await': 2,
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/no-explicit-any': 2,
    'no-shadow': 2,
    'no-var': 2,
    '@typescript-eslint/no-var-requires': 2,
    'max-lines-per-function': [2, 35],
    complexity: 2,
    'max-depth': 2,
    'max-nested-callbacks': 2,
  },
};

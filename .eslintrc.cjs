module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['plugin:prettier/recommended', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
}

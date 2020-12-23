module.exports = {
  extends: [
    'airbnb-base',
    'plugin:cypress/recommended',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  env: {
    node: true,
  },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-return-await': 'off',
  },
  globals: {
    $: 'readonly',
    Quill: 'readonly',
    document: 'readonly',
    FileReader: 'readonly',
  },
};

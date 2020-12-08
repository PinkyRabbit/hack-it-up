module.exports = {
  extends: [
    'airbnb-base',
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
  },
  globals: {
    $: 'readonly',
    Quill: 'readonly',
    document: 'readonly',
    FileReader: 'readonly',
  },
};

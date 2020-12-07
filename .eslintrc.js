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
  rules: {},
  globals: {
    $: 'readonly',
    Quill: 'readonly',
    document: 'readonly',
    FileReader: 'readonly',
  },
};

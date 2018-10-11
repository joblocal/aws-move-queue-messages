module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },

  extends: 'airbnb-base',

  env: {
    es6: true,
    jest: true,
  },

  plugins: [
    'import',
  ],

  // add your custom rules here
  rules: {
    'no-console': 0,
  }
}

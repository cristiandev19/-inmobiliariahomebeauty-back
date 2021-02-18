module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-multi-spaces': ['error', { exceptions: { VariableDeclarator: true } }],
    // no-multi-spaces: "error"
    // "
  },
};

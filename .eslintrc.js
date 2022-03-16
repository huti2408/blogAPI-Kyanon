module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ["prettier"],
  rules: {
    "no-await-in-loop": "off",
    "no-irregular-whitespace": "off",
    "no-restricted-syntax": "off",
    "no-continue": "off",
  },
};

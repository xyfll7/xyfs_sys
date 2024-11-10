
/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: [
    require('postcss-each'),
    // require('postcss-simple-vars'),
    require('postcss-import'),
    require('postcss-nested'),
    // require('postcss-at-rules-variables'),
    require('postcss-preset-env'),
    require('postcss-preset-env'),
    // require('cssnano'),
  ],
};
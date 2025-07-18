// https://commitlint.js.org/#/reference-configuration
const _config = require("./changelog.config");
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [..._config.list]],
    'header-max-length': [2, 'always', _config.maxMessageLength], // 修改为 200
  },
};

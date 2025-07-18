// https://www.npmjs.com/package/git-cz
const _types = {
  wip: {
    description: 'Work in progress.',
    emoji: '🚧',
    value: 'wip'
  },
  feat: {
    description: 'A new feature',
    emoji: '🫧 ',
    value: 'feat'
  },
  fix: {
    description: 'A bug fix',
    emoji: '🦟',
    value: 'fix'
  },
  clean: {
    description: 'Cleanup code/files',
    emoji: '🧬',
    value: 'clean'
  },
  style: {
    description: 'Markup, white-space, formatting, missing semi-colons...',
    emoji: '🌈',
    value: 'style'
  },
  config: {
    description: 'Modify configuration',
    emoji: '🔧',
    value: 'config'
  },
};
module.exports = {
  disableEmoji: false,
  format: '{type}{scope}: {emoji}{subject}',
  list: [...Object.keys(_types)],
  maxMessageLength: 200,
  minMessageLength: 3,
  questions: ['type', 'scope', 'subject', 'issues'],
  scopes: ['project', 'client', 'admin', 'cloud'],
  types: {
    ..._types,
    messages: {
      type: 'Select the type of change that you\'re committing:',              // ✔︎
      customScope: 'Select the scope this component affects:',                 // ✔︎
      subject: 'Write a short, imperative mood description of the change:\n',  // ✔︎
      body: 'Provide a longer description of the change:\n ',
      breaking: 'List any breaking changes:\n',
      footer: 'Issues this commit closes, e.g #123:',                          // ✔︎
      confirmCommit: 'The packages that this commit has affected\n',
    },
  }
};

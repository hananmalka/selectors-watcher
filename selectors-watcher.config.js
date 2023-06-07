module.exports = {
  selectorsType: ["data-qa-id", "id", "class"],
  watchPaths: ['src/', 'styles/'],
  ignoredFiles: ['node_modules/', 'dist/'],
  keyword: 'selector1',
  slack: {
    channel_id: "C01V3TKV67R",
    token: ""

  },
  github: {
    reviewers: [],
    owner: "Hanan",
    repo: "repo",
    octokit_token: ""
  },
  notification_level: "commit"
};

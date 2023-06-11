const {executeShellCommand} = require("./helpers");
const { Octokit } = require("@octokit/rest");
const { loadConfig } = require("./configLoader");

const config = loadConfig();
const octokit = new Octokit({ auth: `${config.github.octokit_token}` });

const getPullRequest = async (branchName) => {
  const githubHeaders = {
    owner: config.github.owner,
    repo: config.github.repo,
    head: `${config.github.owner}/${config.github.repo}/${branchName}`
  }
  const response = await octokit.request("GET /repos/{owner}/{repo}/pulls", githubHeaders);
  return response.data;
}

const getCurrentBranch = async () => {
  return executeShellCommand("git rev-parse --abbrev-ref HEAD | awk '{$1=$1};1' | tr -d '\\n'");
};

const addReviewersToPullRequest = async (pullRequest) => {
  const reviewers = config.github.reviewers;
  const prCurrentReviewers = pullRequest[0].requested_reviewers;
  const missingReviewers = reviewers.filter(value => !prCurrentReviewers.includes(value));
  const githubHeaders = {
    owner: config.github.owner,
    repo: config.github.repo,
    pull_number: pullRequest[0].number,
    reviewers: missingReviewers
  }

  const response = await octokit.request("POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers", githubHeaders);
  return response.data;
};

module.exports = {
  getPullRequest,
  getCurrentBranch,
  addReviewersToPullRequest
}

#!/usr/bin/env node

const { executeShellCommand, sendSlackMessage, getDiffBetweenStrings } = require("./utils/helpers");
const { getCurrentBranch, getPullRequest, addReviewersToPullRequest } = require("./utils/githubUtils");
const { loadConfig } = require("./utils/configLoader");

const config = loadConfig();

const getSelectorsChanges = async () => {
  let greppedValue = ""
  config.selectorsType.forEach((selector, index) => {
    greppedValue += selector + "=" + (index === config.selectorsType.length - 1 ? "" : "|");
  })
  const changedLines = await executeShellCommand(
      `git diff HEAD --word-diff | grep -E "${greppedValue}" | grep + | awk '{$1=$1};1'`
  );
  return changedLines.split("\n");
};

const getOldNewAChangesArray = (gitChanges) => {
  const changesObjectArray = [];
  const selectorNames = config.selectorsType.join("|");
  let match;
  const regexPattern = new RegExp(`\\[-(.*?${selectorNames}.*?)-\\]\\{\\+(.*?${selectorNames}.*?)\\+\\}`, 'g');
  for (let i = 0; i < gitChanges.length - 1; i += 1) {
    while ((match = regexPattern.exec(gitChanges[i])) !== null) {
      const oldValue = match[1];
      const newValue = match[2];
      const difference = getDiffBetweenStrings(oldValue, newValue);
      const changesObject = {
        old: oldValue,
        new: newValue,
        diff: difference
      }
      changesObjectArray.push(changesObject);
    }
  }
  return changesObjectArray;
}

(async function() {
  try {
    const selectorsChanges = await getSelectorsChanges();
    let notificationMessage = "";
    if (selectorsChanges) {
      const arrayOfChangedSelectors = getOldNewAChangesArray(selectorsChanges);
      if(arrayOfChangedSelectors.length !== 0) {
        if (config.notification_level === "pr") {
          const currentBranch = await getCurrentBranch();
          const pullRequest = await getPullRequest(currentBranch);
          if (pullRequest.length === 0) {
            console.log("Pull request wasn't opened yet. Notification to infra team will be sent when PR is open")
          } else {
            await addReviewersToPullRequest(pullRequest);
            notificationMessage = await constructNotificationMessage(arrayOfChangedSelectors);
            notificationMessage += notificationMessage +
                "You were added as a reviewer to the PR: \n" +
                `https://github.com/${config.github.owner}/${config.github.repo}/pull/${pullRequest[0].number}`
          }
        }
        notificationMessage = await constructNotificationMessage(arrayOfChangedSelectors);
        await sendSlackMessage(notificationMessage);
      } else {
        console.log("Selectors format is not supported yet")
      }
    } else {
      console.log("Automation selectors weren't changed");
    }
  } catch (e) {
    console.log(
        "Failed in pre-push: automation ID changes notifications. Please make sure to update Infra team about the changes", e
    );
  }
})();

const constructNotificationMessage = async(arrayOfChangedSelectors) => {
  console.log("arrayOfChangedSelectors", arrayOfChangedSelectors)
  const currentBranch = await getCurrentBranch();
  console.log(currentBranch)
  let selectorsChangesFormatted = "";
  const separator = '\n-----------------------------------------------------------------------------\n'
  for (let i = 0; i < arrayOfChangedSelectors.length; i += 1) {
    const idChangesFormat = "*Origin:* " + arrayOfChangedSelectors[i].old + "\n" +
        "*New:* " + arrayOfChangedSelectors[i].new + "\n" +
        "*Diff:* " + arrayOfChangedSelectors[i].diff.action + " *\"" + arrayOfChangedSelectors[i].diff.value
        + "\"* " + (i === arrayOfChangedSelectors.length - 1 ? "\n" : separator);
    selectorsChangesFormatted += idChangesFormat;
  }
  return ":Warning: The following selectors has been changed:\n\n" +
      `${selectorsChangesFormatted}\n` +
      "*Branch*: " + currentBranch + "\n" +
      "*Service*: " + config.github.repo + "\n";
}

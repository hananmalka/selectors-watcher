const util = require("util");
const axios = require("axios");
const diff = require('diff');

const { loadConfig } = require("./configLoader");
const exec = util.promisify(require("child_process").exec);

const config = loadConfig();

const executeShellCommand = async (command) => {
  const { error, stdout, stderr } = await exec(`${command}`);
  return stdout;
};

const getDiffBetweenStrings = (oldValue, newValue) => {
  const difference = {};
  diff.diffWords(oldValue, newValue).filter((item) => {
    if (item.added && item.value !== "+") {
      difference.action = "added";
      difference.value = item.value;
    } else if (item.removed && item.value !== "-") {
      difference.action = "removed";
      difference.value = item.value;
    }
  });
  return difference;
}

const sendSlackMessage = async (message) => {
  await axios.post('https://slack.com/api/chat.postMessage', {
    channel: config.slack.channel_id,
    text: message
  }, {
    headers: {
      'Authorization': `Bearer ${config.slack.token}`,
      'Content-Type': 'application/json'
    }
  })
};

module.exports = {
  executeShellCommand,
  getDiffBetweenStrings,
  sendSlackMessage
}

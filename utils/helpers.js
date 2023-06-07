const util = require("util");
const axios = require("axios");
const { loadConfig } = require("./configLoader");
const exec = util.promisify(require("child_process").exec);

const config = loadConfig();

const executeShellCommand = async (command) => {
  const { error, stdout, stderr } = await exec(`${command}`);
  return stdout;
};

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
  sendSlackMessage
}

const defaultConfig = require('../selectors-watcher.config');
const path = require("path");

const loadConfig = () => {
  // Load configuration from different sources, merge and return the final config object
  const overrideConfig = getConfig();
  return {...defaultConfig, ...overrideConfig};
}

const getConfig = () => {
  try {
    // Retrieve the configuration file path from command-line arguments
    const configFilePath = process.argv.slice(2).find(arg => arg.startsWith('--config=') || arg.startsWith('-c='));

    // Check if the configuration file path is provided
    if (!configFilePath) {
      console.error('Please provide a configuration file using the --config option.');
      process.exit(1);
    }

    // Remove the '--config=' prefix from the argument to get the file path
    const filePath = configFilePath.split('=')[1];
    const configPath = path.join(process.cwd(), filePath);
    return require(configPath);
  } catch (error) {
    console.error('Error reading configuration file:', error);
    process.exit(1);
  }
}

module.exports = {
  loadConfig
};

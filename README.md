
# selectors-watcher

`selector-watcher` act as a git hook and notify relevant stakeholders with any selectors change
in order to avoid instability and lack of communication between developers and automation engineers


## Features

- Detect code changes according to predefined selectors
- Notify stakeholders using **Slack**, showing the old and the new versions of changed selectors
- Add relevant stakeholders as a reviewers in case pull request exists


## Installation & Usage

Install selectors-watcher in your development project

```bash
  npm install selectors-watcher
```

In `package.json` file, you should define a script that executes selectors-watcher.  
In this example it named `watch` but of you can call it whatever you want. 

For example:

```json
"scripts": {
    "watch": "node selectors-watcher --config=PATH_TO_CONFIG_FILE" 
}
```

The script should be defined as a pre-commit/pre-push githook.

For example: (Using [husky](https://dev.to/devictoribero/how-to-use-husky-to-create-pre-commit-and-pre-push-hooks-4448) githooks)

```json
"husky": { 
  "hooks":
	{
      "pre-commit": "npm run watch"
    }
}
```

OR 
```json
"husky": { 
  "hooks":
	{
      "pre-push": "npm run watch"
    }
}
```

When developer making changes in one of the selectors defined in the configuration file (See below) and preapring the code for commit/push - `selectors-watcher` detect the changes and notify to the relevant stakeholders (Also included in configuration file)
## Configuration file

`selectors-watcher` has a configuration file with defualt values.   
All attributes can be override but there are attributtes that **MUST** be chaged in order to perform full functionality.  
In order to override the values, you need to create a configuration file in your develpment project and provide `-c, --config` in your script with the path to it.

Here is a description of different configuration attributtes:
 
- `channel_id` - The Slack channel ID whre you want to send the notification
- `token` - Slack token to use for sending messages.  
    Here is a begginer explantion of [How to quickly get and use a Slack API token.](https://api.slack.com/tutorials/tracks/getting-a-token)
- `reviewers` - Array of github users/groups you would like to add as reviewers for the pull request including the selectors changes.
- `owner` - github owner.
- `repo` - github repo name
- `token` - The access token for using github REST API request. [How to create?](https://docs.github.com/en/rest/overview/authenticating-to-the-rest-api?apiVersion=2022-11-28#authenticating-with-a-personal-access-token)


```json
{
    //The selectors you want to detect changes (e.g. "test-id", "qa-id" etc')
    "selectorsType": ["id"],
    "slack": {
      "channel_id": "",
      "token": ""
    },
    "github": {
      "reviewers": [],
      "owner": "",
      "repo": "",
      "octokit_token": ""
    },
    /* The notification can be sent before pull reqest created or only after.
    *  If the notification_level="commit", the notification will be sent before PR opened.
    *  If the notification_level="pr", the notification will be sent only after PR opened.
    */
    "notification_level": "commit"  //"commit" OR "pr"
}
```

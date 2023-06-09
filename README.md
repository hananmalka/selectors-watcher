
![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)


# selectors-watcher

`selector-watcher` act as a git hook and notify relevant stakeholders with any selectors change
in order to avoid instability and lack of communication between developers and automation engineers


## Features

- Detect code changes according to predefined selectors
- Notify stakeholders using slack, showing the old and the new versions of changed selectors
- Add relevant stakeholders as a reviewers in case pull request already exists


## Installation & Usage

Install selectors-watcher with npm in you development project

```bash
  npm install selectors-watcher
```

Selectors watcher acts as a git hook so the npm command which execute the selectors-watcher should be defined


## Configuration file

`selectors-watcher` has configuration file with defualt values.  
Still there are attributtes that **MUST** be chaged in order to perform full functionaly like:

- Adding reviewers to github


```json
{
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
    "notification_level": "commit"
}
```

Selectors watcher acts as a git hook so the npm command which execute the selectors-watcher should be defined



## 🚀 About Me
I'm a full stack developer...


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://katherinempeterson.com/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/)


## 🛠 Skills
Javascript, HTML, CSS...


## Common used arguments
This arguments are commonly used in tests execution:

- `-d, --device-id` - Target device id or name (prefixes allowed)
- `--plain-name=<substring>` - A plain-text substring of the names of tests to run.
- `-t, --tags` - Run only tests associated with the specified tags. See: https://pub.dev/packages/test#tagging-tests
- `-x, --exclude-tags` - Run only tests that do not have the specified tags. See: https://pub.dev/packages/test#tagging-tests




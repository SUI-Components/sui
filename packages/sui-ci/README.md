# sui-ci

> CLI with some useful commands for Travis CI

It provides:
* A way to update a GitHub Commit Status from a CI environment with `update-commit-status` command.
* A way to publish through CI all packages that used `sui-mono` with `release` command.

## release

### Requirements

The following environment variables are used:
* `GITHUB_TOKEN`: GitHub Personal Access Token of the user that will create the commit with the release.
 
Other optional environment variables are:
* `GITHUB_USER`: GitHub username of the user that will create the commit with the release.
* `GITHUB_EMAIL`: GitHub email of the user that will create the commit with the release.

When using *Travis* as CI it also uses:
* `TRAVIS_PULL_REQUEST`: The pull request number if the current job is a pull request, `false` if it's not a pull request.

When using *GitHub Actions* as CI it also uses:
* `GITHUB_REF`: The branch ref that triggered the workflow. For example, refs/heads/feature-branch-1.

### Usage

The **recommended way** to use this is adding in your `travis.yml` as latest step of the `script` lifecycle the next command `npx @s-ui/ci release`:

```yaml
script:
  - npx @s-ui/ci release
```

The reason why we need to use the `script` lifecycle is because is the last step in Travis to determine if a build is failing. You could safely use in next job cycles like `after_success` but keep in mind that if the release fails the build won't change. 

## update-commit-status

### Requirements

Right now, it relies on some environment variables:
* `GITHUB_TOKEN`: GitHub Personal Access Token of the user that will create the status of the commit.
* `SUI_CI_TOPIC`: Environment variable to tell the CI which topic the commit is about. If not defined, you must use the `--topic` parameter in order to define the topic that you're talking about. 

When using *Travis* as CI, *@s-ui/ci* uses the next environment variables are expected: `TRAVIS_BUILD_WEB_URL`, `TRAVIS_COMMIT`, `TRAVIS_PULL_REQUEST_SHA`, `TRAVIS_REPO_SLUG`.

When using *GitHub Actions* as CI, it uses:
`GITHUB_EVENT_PATH`, `GITHUB_SHA`, `GITHUB_RUN_ID`, `GITHUB_SERVER_URL`.

### Usage

```
Usage: sui-ci update-commit-status [options]

Options:
  -s, --state <stateKey>  State of the commit. Accepted values:"OK", "KO", "RUN" (default: "KO")
  -t, --topic <ciTopic>   Topic telling what is the commit about. Required if ENV VAR not defined (default: process.env.SUI_CI_TOPIC)
  -u, --url <targetUrl>   Url where the details link navigates to (default: <travis-build-url>)
  -h, --help              display help for command
```

For example, you could use the CLI directly by using `npx` with that.

```sh
$ npx @s-ui/ci update-commit-status --state OK --topic build 
```

#### Topics

When you use `topic` parameter you'll get a default message for each state (success, fail and pending). There's a special list of topics that have their own message to improve readability: `lint`, `tests`, `deploy`, `install`, `bundle`.

### In Action
![image](https://user-images.githubusercontent.com/1561955/88173732-5d551480-cc23-11ea-986f-9073c188c2db.png)

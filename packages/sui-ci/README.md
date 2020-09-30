# sui-ci

> CLI with some useful commands for Travis CI

It provides:
* A way to update a GitHub Commit Status from a CI environment with `update-commit-status` command.
* A way to publish through CI all packages that used `sui-mono` with `release` command.

## release

### Requirements

The following environment variables are needed:
* `GITHUB_TOKEN`: GitHub Personal Access Token of the user that will create the commit with the release.
* `TRAVIS_PULL_REQUEST`: The pull request number if the current job is a pull request, `false` if it's not a pull request.
 
Other optional enviromnet variables are:
* `GITHUB_USER`: GitHub username of the user that will create the commit with the release.
* `GITHUB_EMAIL`: GitHub email of the user that will create the commit with the release.


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
* `SUI_CI_TOPIC`: *Optional* but useful environment variable to tell the CI which topic the commit is about.

*@s-ui/ci* right now expects it's using *Travis* to execute CI, so the next environment variables are expected: `TRAVIS_BUILD_WEB_URL`, `TRAVIS_COMMIT`, `TRAVIS_PULL_REQUEST_SHA`, `TRAVIS_REPO_SLUG`.

### Usage

```
Usage: sui-ci update-commit-status [options]

Options:
  -s, --state <stateKey>  State of the commit. Accepted values:"OK", "KO", "RUN" (default: "KO")
  -u, --url <targetUrl>   Url where the details link navigates to (default: <travis-build-url>)
  -t, --topic <ciTopic>   Topic telling what is the commit about (default: process.env.SUI_CI_TOPIC)
  -h, --help              display help for command
```

For example, you could use the CLI directly by using `npx` with that.

```sh
$ npx @s-ui/ci update-commit-status --state OK --topic build 
```

### In Action
![image](https://user-images.githubusercontent.com/1561955/88173732-5d551480-cc23-11ea-986f-9073c188c2db.png)

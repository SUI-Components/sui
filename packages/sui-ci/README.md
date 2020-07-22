# sui-ci

> CLI with some useful commands for CI environments

It provides:
* A way to update a GitHub Commit Status on a CI environment.

## Requirements

Right now, it relies on some environemnt variables:
* `GH_TOKEN`: GitHub Personal Access Token of the user that will create the status of the commit.

## Usage

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
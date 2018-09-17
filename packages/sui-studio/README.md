# sui-studio
> Develop, maintain and publish your SUI components.


Sui Studio helps you to develop and document isolated UI components for your projects. It provides:

* Isolated development of components
* Unified development platform
* Productivity improvement focusing of component development experience
* Live Demos as a base of work (with auto-generated playgrounds)
* Components discovery catalog generated from live demos and markdown docs.

![](./assets/sui-studio-demo.gif)

## Installation

```sh
npm install @s-ui/studio
```

## Getting Started

In case you want to create a new studio, check out [sui-studio-create](https://github.com/SUI-Components/sui/tree/master/packages/sui-studio-create)

Once you're in the new project, you can execute `sui-studio start` in order to start the development browser and start working on your components.




## Common Workflow

### Creating a new component
#### 1) Create a component

```sh
$ sui-studio generate house window
```

#### 2) Install component dependencies

```sh
$ sui-studio run-all npm install
```

#### 3) Commit changes using the appropiate command

First of all, stage you changes for commit with ```git add``` or whatever you use.

DO NOT use ```git commit``` directly. Instead, use:

```sh
$ npm run co
```

Add the script to your package.json

```json
{
  "scripts": {
    "co": "sui-studio commit"
  }
}
```

It will prompt a question form. The way you answer to this question form affects the way the commit's comment is built. Comments will be used later, after merging to master in order to decide what kind of change (release) is going to be done (minor or major).

Then just push your changes using ```git push``` and merge them into master after review.

#### 4) Release

Select master branch. First, check that the release will be properly built by executing:
```
$ sui-studio check-release
```
If the output is the expected then run:
```
$ sui-studio release
```

## CLI

### `$ sui-studio link-all`

Executes internally `$ sui-mono link`, that links all components to each other.


### `$ sui-studio run-all`

Executes internally `$ sui-mono run`, that executed a command **in series** on each package folder.

### `$ sui-studio run-parallel`

Executes internally `$ sui-mono run-parallel`, that executed a command **in parallel** on each package folder.

# Conventions

## Naming
lowerCamelCase is the choice for directories and files.
```
components/house/mainWindow/...
```

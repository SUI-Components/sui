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
npm install sui-studio -g
```

## Getting Started

First install suistudio:

```sh
npm i -g @schibstedspain/sui-studio
suistudio init <project_name>
cd <project_name>
```

Once you're in the new project, you can execute `suistudio start` in order to start the development browser and start working on your components.

# Workflows

## Creating a new component
### 1) Create a component

```sh
$ suistudio generate house window
```

### 2) Install component dependencies

```sh
$ suistudio run-all npm install
```

### 3) Commit changes using the appropiate command

First of all, stage you changes for commit with ```git add``` or whatever you use.

DO NOT use ```git commit``` directly. Instead, use:

```sh
$ npm run co
```

It will prompt a question form. The way you answer to this question form affects the way the commit's comment is built. Comments will be used later, after merging to master in order to decide what kind of change (release) is going to be done (minor or major).

Then just push your changes using ```git push``` and merge them into master after review.

### 4) Release

Select master branch. First, check that the release will be properly built by executing:
```
$ suistudio check-release
```
If the output is the expected then run:
```
$ suistudio release
```

# Conventions
## Naming
lowerCamelCase is the choice for directories and files.
```
components/house/mainWindow/...
```

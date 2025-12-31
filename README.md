# PR-CLI

A tool that allows users to create and manage pull requests from the command line

## Features
### Core pull request operations
- List pull requests
- Create a pull request
- Get a pull request
- Update a pull request
### Pull request inspection
- List commits on a pull request

#### Features Coming
>- List pull requests files
>- Check if a pull request has been merged
>- Merge a pull request
>- Update a pull request branch


## Architecture 

```
pr-cli/
├── bin/
├── src/
│   ├── commands/
│   ├── config/
│   ├── services/
│   ├── utils/
│   └── index.ts
├── package.json
├── README.md
└── tsconfig.json
```


## Installation

Clone the repository:

```bash
git clone https://github.com/LewieJ08/pr-cli.git
cd pr-cli
```
Install dependencies:

```bash
npm install
```
Build the TypeScript code:

```bash
npm run build
```

Link the CLI globally:

```bash
npm link
```

## Usage

Run the PR command 

```bash
# main pr command
pr <command>

# help command
pr -h 

# dev script
npm run dev <command>
```
# PR-CLI

A tool that allows users to create and manage pull requests from the command line. Planning to publish on NPM when at a more complete state.

## Features
### Core pull request operations
- [List pull requests](#pr-list)
- [Create a pull request]
- Get a pull request
- Update a pull request
### Pull request inspection
- List commits on a pull request
- List pull requests files
- Check if a pull request has been merged
### Pull request actions
- Merge a pull request
- Update a pull request branch


## Architecture 

```
pr-cli/
├── bin/            # Executable pr program
├── src/            # Source code
│   ├── commands/   # Core command logic files
│   ├── config/     # Configuration (GitHub token, env vars)
│   ├── services/   # Third party services
│   ├── utils/      # Global utils
│   └── index.ts    # CLI entry point
├── package.json
├── README.md
└── tsconfig.json
```


## Installation

If you do not have a Github token you will need to create one. We recommend a github fine-grained token:
https://github.com/settings/personal-access-tokens

Ensure you have these permissions 
![Github Perms](/docs/perms.png)

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

## Commands

### ```pr list```

List pull requests

#### Usage 
```pr list [options] ```

#### Options

```-a, --all```

List all pull requests open and closed. This option cannot be used with the ```--state``` option.

```--state [state]```

Set state of pull request either ```open``` or ```closed```. Cannot be used with ```--all``` option.

Default: ```open```

```--sort [sort]```

What to sort pull requests by. ```popularity``` will sort by the number of comments. ```long-running``` will sort by date created and will limit the results to pull requests that have been open for more than a month and have had activity within the past month.

Default: ```created```

Can be one of: ```created```, ```updated```, ```popularity```, ```long-running``` 

#### Example Usage (Colours will differ)
``` bash
> pr list --state closed 

PR #25 CLOSED https://github.com/LewieJ08/pr-cli/pull/25
Refactor pr-merge edge case handling
Merged mainline ← develop
Author: LewieJ08 · Created: Thu, 08 Jan 2026 16:00:49 GMT
────────────────────────────────────────────────────────────

PR #26 CLOSED https://github.com/LewieJ08/pr-cli/pull/26
TEST PR FOR CLOSING
Not Merged mainline ← test/close-pr
Author: LewieJ08 · Created: Fri, 09 Jan 2026 16:08:59 GMT
────────────────────────────────────────────────────────────
>
```

### ```pr create```

Create a pull request. When using this command you will be asked to provide the PR title and body.

#### Usage 
```pr create [options]```

#### Options

```-d, --draft```

Create a draft pull request

#### Example usage
```bash
> pr create 
PR Title > New feature added
PR body > Added a new feature that does something i guess

Pull Request 29 for 'REPO' created successfully 
https://github.com/LewieJ08/REPO/pull/29
```

### ```pr get```

Get a pull request



### ```pr update```

Update a pull request

### ```pr commits```

List commits on a pull request

### ```pr files```

List files in a pull request 

### ```pr status```

Check if a pull request has been merged

### ```pr merge```

Merge a pull request

### ```pr sync```

Update and sync a pull request branch



# PR-CLI

A tool that allows users to create and manage pull requests from the command line. Planning to publish on NPM when at a more complete state.

## Features
### Core pull request operations
- [List pull requests](#pr-list)
- [Create a pull request](#pr-create)
- [Get a pull request](#pr-get)
- [Update a pull request](#pr-update)
### Pull request inspection
- [List commits on a pull request](#pr-list)
- [List pull requests files](#pr-files)
- [Check if a pull request has been merged](#pr-status)
### Pull request actions
- [Merge a pull request](#pr-merge)
- [Update a pull request branch](#pr-sync)


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

If you do not have a Github token you will need to create one. We recommend a personal fine-grained token:
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

PR 25 CLOSED https://github.com/LewieJ08/pr-cli/pull/25
Refactor pr-merge edge case handling
Merged mainline ← develop
Author: LewieJ08 · Created: Thu, 08 Jan 2026 16:00:49 GMT
────────────────────────────────────────────────────────────

PR 26 CLOSED https://github.com/LewieJ08/pr-cli/pull/26
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

#### Usage 
```pr get <pr-number>```

#### Example Usage
```bash
> pr get 5
PR 16 CLOSED https://github.com/LewieJ08/pr-cli/pull/16
Merged mainline ← develop
Author: LewieJ08 · Created: Tue, 30 Dec 2025 00:50:11 GMT
────────────────────────────────────────────────────────────
Refactor error types in each command
Added the 'unknown' type to all errors in command files
>
```

### ```pr update```

Update a pull request. When using this command you will be asked for the new PR title and body similar to ```pr create```

#### Usage
```pr update <pr-number>```

#### Example Usage 
```bash
> pr update 20
New Title > Updated title for new feature or something
New Body > New body of long text for pointless feature

Pull Request 20 for 'REPO' Updated Successfully 
https://github.com/LewieJ08/REPO/pull/20
> 
```

### ```pr commits```

List commits on a pull request

#### Usage 
```pr commits <pr-number>```

#### Example Usage
```bash 
> pr commits 14
Pull request #14 commits:

commit d2ae3ca0a7753e3162b08ac52fae95b22e06e923
Author: LewieJ08
Date: Sun, 21 Dec 2025 22:17:11 GMT

    Add ? operator to body property of PullRequest interface

commit d87e063671cd8425d0b0ab1eeaeaae9648208a95
Author: LewieJ08
Date: Tue, 23 Dec 2025 04:09:27 GMT

    Refactor pull requesr display for get and list

commit da36bcc440d3d3ed9fa9817759100802052586a2
Author: LewieJ08
Date: Tue, 23 Dec 2025 04:14:02 GMT

    Resolve conflict

>
```

### ```pr files```

List files in a pull request, including file changes

#### Usage 
```pr files <pr-number>```

#### Example Usage 
```bash
> pr files 2
Pull request #2 files:

src/commands/create.ts
Changes: +4 -3 (7)

@@ -1,15 +1,16 @@
-import { TOKEN } from "../config/env";
+import { resolveGithubToken } from "../config/env";
+import { resolveGitContext } from "../utils/gitContext";
 import { GithubService } from "../services/githubService";
 import { prompt } from "../utils/prompt";
 import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/gitUtils";
-import { resolveGitContext } from "../utils/gitContext";

 async function createCommand(): Promise<void> {
     try {
         const context = resolveGitContext();
+        const token = resolveGithubToken();

         const github = new GithubService({
-            token: TOKEN,
+            token: token,
             owner: context.owner,
             repo: context.repo
         });

src/commands/list.ts
Changes: +5 -3 (8)

@@ -1,13 +1,15 @@
-import { TOKEN } from "../config/env";
+import { resolveGithubToken } from "../config/env";
 import { resolveGitContext } from "../utils/gitContext";
 import { GithubService } from "../services/githubService";
 import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/gitUtils";

 async function listCommand(): Promise<void> {
     try {
-        const { owner, repo } = resolveGitContext();
+        const { owner, repo } = resolveGitContext();
+        const token = resolveGithubToken();
+
         const github = new GithubService({
-            token: TOKEN,
+            token: token,
             owner: owner,
             repo: repo
         });

src/config/env.ts
Changes: +6 -11 (17)

@@ -1,16 +1,11 @@
 import { configDotenv } from "dotenv";
 configDotenv({quiet: true});

-// fetch env vars
-function fetchEnvVar(name: string): string {
-    const value = process.env[name];
-
-    if (!value) {
-        console.log(`Missing required environment variable: ${name}`);
-        process.exit(1)
+// get github token env var
+export function resolveGithubToken(): string {
+    if (process.env.GITHUB_TOKEN) {
+        return process.env.GITHUB_TOKEN
     }

-    return value;
-}
-
-export const TOKEN = fetchEnvVar('TOKEN');
\ No newline at end of file
+    throw new Error("Missing Github Token Config. Please run 'pr auth login' to authenticate")
+}
\ No newline at end of file

> 
```

### ```pr status```

Check if a pull request has been merged

#### Usage 
```pr status <pr-number>```

#### Example Usage 
```bash
> pr status 1
Pull Request #1
Merge Status: Merged
> 
```

### ```pr merge```

Merge a pull request. When using this command you will be asked if you are sure you want to merge the pull request.

#### Usage
```pr merge [options] <pr-number>```

#### Options    
```-m, --method [merge-method]```

Set the merge method to use.

Can be one of: ```merge```, ```squash```, ```rebase``` 

#### Example Usage
```bash 
> pr merge 33
Are you sure you want to merge PR #33 (y/n) > y
Pull Request #33 successfully merged
>
```

### ```pr sync```

Update and sync a pull request branch. This is a good way to ensure your pull request remain up to date with the main branch when new commits have been pushed into the main branch. You will be asked to input the latest commit SHA (hash) in the pull request. This can be found using ```pr commits```

#### Usage 
```pr sync <pull-number>```

#### Example Usage
```bash 
> pr sync 33
Enter the latest commit SHA (hash) of the pull request branch (HEAD) > e39b3fb4owd39rh4fnienf933f
Pull Request branch successfully updated and synced
>
```



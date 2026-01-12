import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/git.utils.js";
import { logError, logWarn } from "../utils/logger.utils.js";
import { bold } from "../utils/color.utils.js";
import { GithubService } from "../services/github.service.js";
import { resolveGitContext } from "../utils/git-context.utils.js";
import { resolveGithubToken } from "../config/env.js";

async function commitsCommand(pullNumber: number): Promise<void> {
    try {
        const context = resolveGitContext();
        const token = resolveGithubToken();
        
        const github = new GithubService({
            token: token, 
            owner: context.owner, 
            repo: context.repo
        });

        const commits = await github.listPullRequestCommits(pullNumber)
        
        console.log(bold(`Pull request #${pullNumber} commits:\n`))
        for (const commit of commits) {
            logWarn(`commit ${commit.sha}`)
            console.log(`Author: ${commit.commit.author.name}`)
            console.log(`Date: ${new Date(commit.commit.author.date).toUTCString()}\n`) 
            console.log(`    ${commit.commit.message}\n`)
        }

    } catch (error: unknown) {
        if (error instanceof NoGitRepoError) {
            logError(error.message);
            process.exit(1);
        }

        if (error instanceof InvalidRemoteUrlError) {
            logError(error.message);
            process.exit(1);
        }

        if (error instanceof Error) {
            if (error.message === '404') {
                logError('Pull Request does not exist')
            } else {
                logError(error.message);
            }
            process.exit(1);
        }

        throw error;
    }
}

export default commitsCommand;
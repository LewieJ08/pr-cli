import { GithubService } from "../services/github.service.js";
import { resolveGitContext } from "../utils/git-context.utils.js";
import { resolveGithubToken } from "../config/env.js";
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/git.utils.js";
import { logError, logInfo, logSuccess } from "../utils/logger.utils.js";
import { prompt } from "../utils/prompt.utils.js";

export interface MergeOptions {
    mergeMethod?: 'merge' | 'squash' | 'rebase';
}

export async function mergeCommand(pullNumber: number, options: MergeOptions): Promise<void> {
    let validInput = false;

    // Confirm user would like to merge pull request
    while (validInput === false) {
        const confirm = await prompt(`Are you sure you want to merge PR #${pullNumber} (y/n) > `);

        switch (confirm.toLowerCase()) {
            case 'y':
                validInput = true;
                break;
            case 'n':
                process.exit(1);
            default:
                logError("Invalid input. must be 'y' or 'n'");
                break;
        }
    }

    try {
        const context = resolveGitContext();
        const token = resolveGithubToken();
        
        const github = new GithubService({
            token: token, 
            owner: context.owner, 
            repo: context.repo
        });

        const pullRequest = await github.getPullRequest(pullNumber);

        if (pullRequest.merged) {
            logInfo(`Pull Request #${pullNumber} already merged.`);
            process.exit(1);
        }

        await github.mergePullRequest(pullNumber, options.mergeMethod);
        logSuccess(`Pull Request #${pullNumber} successfully merged`);
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
                logError('Pull Request not found');
            }
            process.exit(1);
        }
        
        throw error;
    }
}

import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/git.utils.js";
import { logError } from "../utils/logger.utils.js";
import { bold, success, error, dim} from "../utils/color.utils.js";
import { GithubService } from "../services/github.service.js";
import { resolveGitContext } from "../utils/git-context.utils.js";
import { resolveGithubToken } from "../config/env.js";

async function filesCommand(pullNumber: number): Promise<void> {
    try {
        const context = resolveGitContext();
        const token = resolveGithubToken();
        
        const github = new GithubService({
            token: token, 
            owner: context.owner, 
            repo: context.repo
        });

        const files = await github.listPullRequestFiles(pullNumber);

        // Display files
        console.log(bold(`Pull request #${pullNumber} files:\n`));
        for (const file of files) {
            console.log(bold(file.filename));
            console.log(
                'Changes:',
                success(`+${file.additions}`), 
                error(`-${file.deletions}`),
                dim(`(${file.changes})\n`)
            )
            console.log(`${file.patch}\n`);
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
                logError('Pull request does not exist');
            } else {
                logError(error.message);
            }
            process.exit(1);
        }

        throw error;
    }
}

export default filesCommand;
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/git.utils.js"
import { logError} from "../utils/logger.utils.js"
import { warn, bold, dim, success } from "../utils/color.utils.js";
import { GithubService } from "../services/github.service.js";
import { resolveGitContext } from "../utils/git-context.utils.js";
import { resolveGithubToken } from "../config/env.js";

async function getCommand(pullNumber: number): Promise<void> {
    try {
        const context = resolveGitContext();
        const token = resolveGithubToken();

        const github = new GithubService({
            token: token,
            owner: context.owner,
            repo: context.repo,
        });

        const pullRequest = await github.getPullRequest(pullNumber);
        const mergeStatus = pullRequest.merged ? success('Merged') : warn('Pending Merge');
        const state = pullRequest.state === 'open' ? success('OPEN') : dim('CLOSED');
        const body = pullRequest.body?.trim() ?? '';

        // Header
        console.log(
            bold(`PR #${pullRequest.number}`),
            state,
            pullRequest.html_url
        );

        // Merge status / branches
        console.log(
            mergeStatus,
            dim(pullRequest.base.ref),
            dim('←'),
            dim(pullRequest.head.ref)
        );

        // Metadata 
        console.log(
            dim('Author:'),
            pullRequest.user.login,
            dim('·'),
            dim('Created:'),
            new Date(pullRequest.created_at).toUTCString()
        );

        // Divider
        console.log(dim('─'.repeat(60)));

        // Title
        console.log(bold(pullRequest.title));

        // Body 
        if (body.length > 500) {
            console.log(`\n ${body.trim()} \n`);
        } else if (body) {
            console.log(body);
        }

    } catch (error) {   
        if (error instanceof NoGitRepoError) {
            logError(error.message);
            process.exit(1);
        }

        if (error instanceof InvalidRemoteUrlError) {
            logError(error.message);
            process.exit(1);
        }

        if (error instanceof Error) {
            logError(error.message);
            process.exit(1);
        }

        throw error;
    }
}

export default getCommand
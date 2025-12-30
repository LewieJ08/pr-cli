import { resolveGithubToken } from "../config/env.js";
import { resolveGitContext } from "../utils/git-context.utils.js";
import { GithubService } from "../services/github.service.js";
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/git.utils.js";
import { logError } from "../utils/logger.utils.js";
import {warn, bold, dim, success } from "../utils/color.utils.js";

async function listCommand(): Promise<void> {
    try {
        const { owner, repo } = resolveGitContext();    
        const token = resolveGithubToken();
        
        const github = new GithubService({
            token: token, 
            owner: owner, 
            repo: repo
        });

        const pullRequests = await github.listPullRequests();
        
        for (const pullRequest of pullRequests) {
            const mergeStatus = pullRequest.merged ? success('Merged') : warn('Pending Merge');
            const state = pullRequest.state === 'open' ? success('OPEN') : dim('CLOSED');

            // Header
            console.log(
                bold(`PR #${pullRequest.number}`),
                state,
                pullRequest.html_url
            );

            // Title
            console.log(bold(pullRequest.title));

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
            logError(error.message);
            process.exit(1);
        }
        
        throw error;
    }
}

export default listCommand;
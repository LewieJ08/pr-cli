import { execSync } from "child_process";

interface ParsedUrlItems {
    owner: string;
    repo: string;
}

export class NoGitRepoError extends Error {
    constructor() {
        super('pr: Not a git repository');
        this.name = 'NoGitRepoError';
    }
}

export class InvalidRemoteUrlError extends Error {
    constructor() {
        super('pr: Invalid Remote Git URL');
        this.name = 'InvalidRemoteUrlError';
    }
}

export function getCurrentBranch(): string {
    try {
        return execSync('git rev-parse --abbrev-ref HEAD', {stdio: 'pipe'}).toString().trim();
    } catch {
        throw new NoGitRepoError();
    }
}

export function getRemoteUrl(): string {
    try {
        const url = execSync('git config --get remote.origin.url', {stdio: 'pipe'}).toString().trim();
        const cleaned = url.replace(/\.git$/, '');
        return cleaned;
    } catch {
        throw new NoGitRepoError();
    }
}

export function parseRemoteUrl(remoteUrl: string): ParsedUrlItems {
    const match = remoteUrl.match(/github\.com[:/](.+?)\/(.+)/);
    if (!match) {
        throw new InvalidRemoteUrlError();
    }

    return { owner: match[1], repo: match[2] };
}
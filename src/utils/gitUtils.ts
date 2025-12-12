import { execSync } from "child_process";

export function getCurrentBranch(): string {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
}

export function getRemoteUrl(): string {
    return execSync('git config --get remote.origin.url').toString().trim()
}
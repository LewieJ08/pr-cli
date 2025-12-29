import { getCurrentBranch, getRemoteUrl, parseRemoteUrl } from "./git.utils.js";

interface GitContext {
  head: string;
  owner: string;
  repo: string;
}

export function resolveGitContext():  GitContext {
    const head = getCurrentBranch();
    const remoteUrl = getRemoteUrl();
    const { owner, repo } = parseRemoteUrl(remoteUrl);

    return { head, owner, repo };
}
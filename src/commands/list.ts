import { listPullRequests } from "../services/githubService";

async function list(): Promise<void> {
    const pullRequests = await listPullRequests();
}

export default list;
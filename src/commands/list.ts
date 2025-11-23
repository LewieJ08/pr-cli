import { REPO, OWNER, TOKEN } from "../config/env";
import { API_BASE } from "../config/consts";

async function listPullRequests(): Promise<void> {
    try {
        const response = await fetch(`${API_BASE}/${OWNER}/${REPO}/pulls`, {
            method: 'GET',
            headers: {'X-GitHub-Api-Version': '2022-11-28'}
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        console.log("--- Pull Requests ---\n");
        console.log(data);

    } catch(error: unknown) {
        throw error;
    }
}

export default listPullRequests;
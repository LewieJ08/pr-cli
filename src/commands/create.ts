import { REPO, OWNER, TOKEN } from "../config/env";
import { API_BASE } from "../config/consts";

async function createPullRequest(): Promise<void> {
    try {
        const response = await fetch(`${API_BASE}/${OWNER}/${REPO}/pulls`, {
            method: 'POST',
            headers: {'X-GitHub-Api-Version': '2022-11-28'}
        });

        const data = await response.json()

        if (!response.ok) {
            throw new Error (`${response.status}`);
        }

        console.log(data);

    } catch(error: unknown) {
        throw error
    }
}

export default createPullRequest;
import createPullRequest from "../services/githubService";
import { prompt } from "../utils/prompt";

async function create(): Promise<void> {
    const title = await prompt('title > ');
    const body = await prompt('body > ');
    const head = await prompt('head > ');
    const base = await prompt('base > ');

    await createPullRequest(title, body, head, body);
}

export default create;

import { logOptions } from "../utils/options";
import { prompt } from "../utils/prompt";
import listPullRequests from "../commands/list";
import createPullRequest from "../commands/create";

async function dev(): Promise<void> {
    console.clear();
    console.log('--- pr-cli DEV MODE ---\n');
    console.log('**only short command options work in dev mode**');
    console.log('ctrl + c to exit\n');
    logOptions();

    while (true) {
        const command = await prompt('> ')

        switch (command) {
            case '':
                break;
            case 'pr -l':
                await listPullRequests();
                break;
            case 'pr -c': 
                await createPullRequest();
                break;
            default:
                console.log('invalid command');
                console.log('Usage: pr [options]');
                logOptions();
        }
    }
}

if (require.main === module) {
    dev();
}

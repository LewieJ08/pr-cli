import { program } from "..";

function dev(): void {
    console.log('--- pr-cli DEV MODE ---\n');
    console.log('Options: ');
    for (const [_, option] of Object.entries(program.options)) {
        console.log(`${option.flags}    ${option.description}`);
    }
}

if (require.main === module) {
    dev();
}

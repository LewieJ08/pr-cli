import { program } from "..";

function dev(): void {
    console.log('--- pr-cli DEV MODE ---\n');
    console.log('Options: ');
    for (const option of program.options) {
        console.log(`${option.flags}    ${option.description}`);
    }
}

if (require.main === module) {
    dev();
}

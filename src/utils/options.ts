import { program } from "../index";

export function logOptions(): void {  
    console.log('Options: ');
    for (const option of program.options) {
        console.log(`${option.flags}    ${option.description}`);
    }
    console.log(' ')
}
import { Command } from "commander";
import list from "./commands/list";
import create from "./commands/create";

const program = new Command('pr');        

program 
    .description('A cli tool that allows users to create and manage pull requests')
    .version('1.0.0')
    .action(() => {
        program.outputHelp();
    })

program
    .command('list')
    .description('List pull requests')
    .action(() => {
        list();
    })

program
    .command('create')
    .description('Create a pull request')
    .action(() => {
        create();
    })


program.parse();

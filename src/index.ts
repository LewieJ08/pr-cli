import { Command } from "commander";
import listCommand from "./commands/list";
import createCommand from "./commands/create";

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
        listCommand();
    })

program
    .command('create')
    .description('Create a pull request')
    .action(() => {
        createCommand();
    })


program.parse();

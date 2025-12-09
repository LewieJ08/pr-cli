import { Command } from "commander";
import listPullRequests from "./commands/list";
import createPullRequest from "./commands/create";

export const program = new Command('pr');        

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
        listPullRequests();
    })

program
    .command('create')
    .description('Create a pull request')
    .action(() => {
        createPullRequest();
    })


program.parse();

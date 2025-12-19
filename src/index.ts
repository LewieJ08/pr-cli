import { Command } from "commander";
import listCommand from "./commands/list.js";
import createCommand from "./commands/create.js";
import getCommand from "./commands/get.ts";
import { authCommand, AuthOptions } from "./commands/auth.js";

const program = new Command('pr');   

// Main pr commands
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

program 
    .command('get')
    .description('Get a pull request')
    .action(() => {
        getCommand();
    })

// Auth command
program
    .command('auth')
    .description('Authenticate GitHub Token')
    .option('-d, --delete', 'Delete GitHub token from config')
    .action((options: AuthOptions) => {
        authCommand(options);
    })

program.parse();

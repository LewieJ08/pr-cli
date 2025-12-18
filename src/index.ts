import { Command } from "commander";
import listCommand from "./commands/list";
import createCommand from "./commands/create";
import { authCommand, AuthOptions } from "./commands/auth";

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

// Auth command
program
    .command('auth')
    .description('Authenticate GitHub Token')
    .option('-d, --delete', 'Delete GitHub token from config', false)
    .action((options: AuthOptions) => {
        authCommand(options);
    })

program.parse();

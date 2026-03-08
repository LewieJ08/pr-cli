export class CLIError extends Error {
    public readonly exitCode: number;

    constructor(message: string, exitCode: number = 1) {
        super(message);
        this.exitCode = exitCode;
        this.name = 'CLIError'
    }
}

export class NoGitRepoError extends CLIError {
    constructor() {
        super('Not a git repository');
        this.name = 'NoGitRepoError';
    }
}

export class InvalidRemoteUrlError extends CLIError {
    constructor() {
        super('Invalid Remote Git URL');
        this.name = 'InvalidRemoteUrlError';
    }
}

export class TokenExpiredError extends CLIError { 
    constructor() {
        super('GitHub Token expired. Please use pr auth to register a new GitHub token');
        this.name = 'TokenExpiredError'
    }   
}
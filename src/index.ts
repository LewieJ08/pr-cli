function main(): void {
    console.log('PR-CLI')
}

function dev(): void {
    console.log('PR-CLI DEVMODE');
}

if (require.main == module) {
    dev();
} else {
    main();
}
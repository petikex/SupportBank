let readlineSync = require('readline-sync');

console.log("Welcome to SupportBank\n \n");
main();
function main() {
    let compile = false;
    var action;
    while (compile === false) {
        action = readlineSync.question('Would you like to extend the database? (y/n)\n');
        if ((action === 'y') || (action === 'n')) {
            compile = true;
        }
        else {console.log("invalid input \n");}
    }
    if (action === 'y') {
        readFile();
    } else { if (action === 'n') {console.log("Bye bye\n");}}
}

function readFile() {
    var fileName = readlineSync.question('Name of the file to be loaded? \n');
    let fileFound = false;
    let breakCommand = false;
    while ((fileFound === false) && (breakCommand === false)) {
        let fs = require('fs');
        if (fs.existsSync(fileName)) {
           fileFound = true;
           console.log("The file is being loaded \n");
            
        }
        else {
            fileName = readlineSync.question('File not found. Provide valid fileame or type stop \n');
        }
        
        if (fileName === "stop") {
            breakCommand = true;
        }
    }
    main();
}
//let userName = readlineSync.question('Welcome to support\n');
//console.log('Hi ' + userName + '!');
var readlineSync = require('readline-sync');

console.log("Welcome to SupportBank\n \n");
main();
function main() {
    var compile = false;
    while (compile == false) {
        var action = readlineSync.question('Would you like to extend the database? (y/n)\n');
        if ((action == 'y') || (action == 'n')) {
            compile = true;
        }
        else {console.log("invalid input \n");}
    }
    if (action == 'y') {
        readFile();
    }
    
}

function readFile() {
    var fileName = readlineSync.question('Name of the file to be loaded? \n');
    var fileFound = false;
    var breakCommand = false;
    while ((fileFound == false) && (breakCommand == false)) {
        var fs = require('fs');
        if (fs.existsSync(fileName)) {
           fileFound = true;
           console.log("The file is being loaded \n"); 
        }
        else {
            var fileName = readlineSync.question('File not found. Provide valid fileame or type stop \n');
        }
        
        if (fileName == "stop") {
            breakCommand = true;
        }
    }
    main();
}
//var userName = readlineSync.question('Welcome to support\n');
//console.log('Hi ' + userName + '!');
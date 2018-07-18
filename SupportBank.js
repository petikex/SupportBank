let readlineSync = require('readline-sync');
var transactions = [];
var numOfTransactions = 0;
var numOfAccounts = 0;
var accounts = [];
var accountNames = [];
var data = [];

class Account {
    constructor(name,credit) {
        this.name = name;
        this.credit = credit;
        this.transactionReceive = [];
        this.transactionSend = [];
    }
    send(transaction) {
        this.transactionSend.push(transaction);
        this.credit = this.credit - parseInt(transaction.amount);
    }
    receive(transaction) {
        this.transactionReceive.push(transaction);
        this.credit = this.credit + parseInt(transaction.amount);
    }
}

class Transaction {
    constructor(date,from,to,narative,amount) {
        this.date = date;
        this.from = from;
        this.to = to;
        this.narative = narative;
        this.amount = amount;
    }
}





console.log("Welcome to SupportBank\n \n");
main();
function main() {
    let compile = false;
    var action;
    while (compile === false) {
        action = readlineSync.question('Would you like to extend the database or list data? (y/n) (List All, List Account)\n');
        if ((action === 'y') || (action === 'n')) {
            compile = true;
        } else {
            if (action.slice(0,4) === 'List') {
                if (action.slice(4,8) === ' All') {
                    console.log("succes");
                    for (var i = 0; i<numOfAccounts - 1 ; i++) {
                        console.log('Account name: ',accountNames[i],'\nAvailable amount: ',accounts[i].credit);
                    }
                } else {
                    var cAccount = action.slice(5,action.length)
                    var indexOfCAccount = accountNames.indexOf(cAccount);
                    if (indexOfCAccount!== -1) {
                        cAccount = accounts[indexOfCAccount];
                        console.log("Account name: ",cAccount.name, " credit available: ", cAccount.credit);
                        console.log("Transaction history: ");
                        console.log("incoming transactions:");
                        for (var i = 0; i<cAccount.transactionReceive.length; i++) {
                            displayTransaction(cAccount.transactionReceive[i]);
                        }
                        console.log("outgoing transactions:");
                        for (var i = 0; i<cAccount.transactionSend.length; i++) {
                            displayTransaction(cAccount.transactionSend[i]);
                        }
                    }
                }
            } else {console.log("invalid input \n");}
        }
        
    }
    if (action === 'y') {
        readFile();
    } else { if (action === 'n') {console.log("Bye bye\n");}}
}

function displayTransaction(transaction) {
    console.log("From : ",transaction.from, " To: ",transaction.to, "Amount: ", transaction.amount, "Comment: ",transaction.narative);
}


function createAccount(name) {
    if (accountNames.indexOf(name) === -1) {
        accounts.push(new Account(name, 0));
        accountNames.push(name);
        numOfAccounts++;
    }
}

function progressTransaction(transaction) {
    transactions.push(transaction);
    numOfTransactions++;
    createAccount(transaction.from);
    createAccount(transaction.to);
    accounts[accountNames.indexOf(transaction.from)].send(transaction);
    accounts[accountNames.indexOf(transaction.to)].receive(transaction);
}

function readFile() {
    var fileName = readlineSync.question('Name of the file to be loaded? \n');
    let fileFound = false;

    let breakCommand = false;
    while ((fileFound === false) && (breakCommand === false)) {
        let fs = require('fs');
        var temp = fileName;
        if (fs.existsSync(fileName)) {
           fileFound = true;
           console.log("The file is being loaded \n");
           inputData = fs.readFileSync(temp,'utf8');
           inputData = inputData.split('\n');
           var data = [];
           for (var i = 1; i<inputData.length; i++) {
               data.push(inputData[i].split(','));
           }
           
           for (var i = 0; i<data.length; i++) {  
                
                progressTransaction(new Transaction(data[i][0],data[i][1],data[i][2],data[i][3],data[i][4]));
                
            }
            console.log("The file has been added");
            
            
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
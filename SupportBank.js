
var log4js = require('log4js');
var moment = require('moment');
log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

console.log('Welcome to SupportBank\n \n');
let readlineSync = require('readline-sync');
var transactions = [];
var numOfAccounts = 0;
var accounts = [];
var accountNames = [];
var numOfTransactions = 0;
var logger;
const supportedFileFormats = ['csv','son','xml'];

class Account {
    constructor(name,credit) {
        this.name = name;
        this.credit = credit;
        this.transactionReceive = [];
        this.transactionSend = [];
    }
    send(transaction) {
        this.transactionSend.push(transaction);
        if ((transaction.amount !== undefined) && (isValidCredit(transaction.amount))) {
            this.credit = this.credit - parseInt(transaction.amount);
        } else { logger.warn('Uncrecognised transaction value at: \n',transaction);}
    }
    receive(transaction) {
        this.transactionReceive.push(transaction);
        if ((transaction.amount !== undefined) && (isValidCredit(transaction.amount))) {
            this.credit = this.credit + parseInt(transaction.amount);
        }
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

function isValidCredit(credit) {
    var result = true;
    var validValues = ['0','1','2','3','4','5','6','7','8','9','.'];
    for (var j = 0; j<credit.length; j++) {
        if (validValues.indexOf(credit[j]) === -1) {
            result = false;
        }
    }
    return result;
}

function displayTransaction(transaction) {
    console.log('From : ',transaction.from, ' To: ',transaction.to, 'Amount: ', transaction.amount, 'Comment: ',transaction.narative);
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

function logProgress(file) {
    logger = log4js.getLogger(file);
    logger.info('File',file,'is being loaded.');
}

function readFile() {
    var fileName = readlineSync.question('Name of the file to be loaded? \n');
    let fileFound = false;
    logProgress(fileName);
    let breakCommand = false;
    while (!fileFound && !breakCommand) {
        let fs = require('fs');
        var temp = fileName;
        var extension = fileName.slice(fileName.length - 3, fileName.length);
        if ((fs.existsSync(fileName)) && (supportedFileFormats.indexOf(extension) !== -1)) {
           fileFound = true;
           inputData = fs.readFileSync(temp,'utf8');
           progressFile(inputData, extension);
           console.log('The file has been added');
        }
        else {
            if (supportedFileFormats.indexOf(extension) === -1) {logger.error('Unsupported file format! (',extension,')');}
            else {  logger.error('File not found at \n', fileName); }
            fileName = readlineSync.question('Provide valid fileame or type stop \n');
        }
        
        if (fileName === 'stop') {
            breakCommand = true;
        }
    }
    main();
}

function progressFile(fileData, extension) {
    if (extension === 'csv') {
        progressCsv(fileData);
    }
    if (extension === 'son') {
        progressJson(fileData);
    }
    if (extension === 'xml') {
        progressXml(fileData);
    }
}

function progressJson(fileData) {
    fileData = fileData.slice(1,fileData.length -1);
    fileData = fileData.split('{');
    var string;
    for (var i = 1; i<fileData.length ; i++) {
        var string = fileData[i];
        string = string.split('\n');
        for (var j = 0; j<string.length; j++) {
            string[j] = string[j].split('"');
        }
        var temp = [];
        for (var j = 1; j<=4; j++) {
            temp.push(string[j][3]);
        }
        temp.push(string[5][2].slice(2,string[5][2].length));
        progressTransaction(new Transaction(temp[0],temp[1],temp[2],temp[3],temp[4]));
    }
}

function progressXml(fileData) {
    fileData = fileData.split('SupportTransaction');
    for (var i = 1; i<fileData.length - 1; i = i + 2) {
        var data = fileData[i];
        data = data.split('>');
        var temp = [];
        temp.push(xmlDate(data[0].slice(7,data[0].length-1)))
        temp.push(data[7].slice(0,data[7].length-6));
        temp.push(data[9].slice(0,data[9].length - 4));
        temp.push(data[2].slice(0,data[2].length - 13));
        temp.push(data[4].slice(0,data[4].length-7));
        progressTransaction(new Transaction(temp[0],temp[1],temp[2],temp[3],temp[4]));
    }
}

function xmlDate(date) {
    return moment('1900-01-01').add(date, 'day');
}

function progressCsv(fileData) {
    fileData = fileData.split('\n');
    var data = [];
    for (var i = 1; i<fileData.length; i++) {
        data.push(fileData[i].split(','));
    }       
    for (var i = 0; i<data.length - 1; i++) {  
        const temp = data[i];
        if (temp.length !== 5) {logger.warn('Unrecognised transaction at: \n', temp);}     
        progressTransaction(new Transaction(temp[0],temp[1],temp[2],temp[3],temp[4]));
    }
}

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
                    console.log('succes');
                    for (var i = 0; i<numOfAccounts - 1 ; i++) {
                        console.log('Account name: ',accountNames[i],'\nAvailable amount: ',accounts[i].credit);
                    }
                } else {
                    var cAccount = action.slice(5,action.length)
                    var indexOfCAccount = accountNames.indexOf(cAccount);
                    if (indexOfCAccount!== -1) {
                        cAccount = accounts[indexOfCAccount];
                        console.log('Account name: ',cAccount.name, ' credit available: ', cAccount.credit);
                        console.log('Transaction history: ');
                        console.log('incoming transactions:');
                        for (var i = 0; i<cAccount.transactionReceive.length; i++) {
                            displayTransaction(cAccount.transactionReceive[i]);
                        }
                        console.log('outgoing transactions:');
                        for (var i = 0; i<cAccount.transactionSend.length; i++) {
                            displayTransaction(cAccount.transactionSend[i]);
                        }
                    }
                }
            } else {console.log('invalid input \n');}
        }
        
    }
    if (action === 'y') {
        readFile();
    } else { if (action === 'n') {console.log('Bye bye\n');}}
}

main();
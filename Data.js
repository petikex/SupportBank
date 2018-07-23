const types = require('./SupportTypes');
var transactions = [];
var accounts = [];

function createAccount(name) {
    if (!accounts[name]) {
        accounts[name] = new types.Account(name, 0);
    }
    return name;
}

function progressTransaction(transactionArray) {
    transaction = new types.Transaction(transactionArray[0],transactionArray[1],transactionArray[2],transactionArray[3],transactionArray[4])
    transactions.push(transaction);
    accounts[createAccount(transaction.from)].send(transaction);
    accounts[createAccount(transaction.to)].receive(transaction);
}

module.exports = {progressTransaction, accounts, transactions};
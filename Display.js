const data = require('./Data')

function displayAll () {
    Object.values(data.accounts).forEach( account => {
        console.log('Account name: ',account.name,'\nAvailable amount: ',account.credit);
    });
}

function displayAccount(accountName) {
    if (data.accounts[accountName]) {
        cAccount = data.accounts[accountName];
        console.log('Account name: ',cAccount.name, ' credit available: ', cAccount.credit);
        console.log('Transaction history: ');
        console.log('incoming transactions:');
        cAccount.transactionReceive.forEach(displayTransaction);
        console.log('outgoing transactions:');
        cAccount.transactionSend.forEach(displayTransaction);
    }
}

function displayTransaction(transaction) {
    console.log('From : ',transaction.from, ' To: ',transaction.to, 'Amount: ', transaction.amount, 'Comment: ',transaction.narative);
}

module.exports = {displayAll, displayAccount}
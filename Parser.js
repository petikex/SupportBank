const moment = require('moment');
const progress = require('./Data')

function progressFile(fileData, extension) {
    switch (extension) {
        case 'csv':
            progressCsv(fileData);
            break
        case 'son':
            progressJson(fileData);
            break
        case 'xml':
            progressXml(fileData);
    }
}

function progressJson(fileData) {
    const values = JSON.parse(fileData);
    values.forEach(transaction => {
        progress.progressTransaction([transaction.Date,transaction.FromAccount,transaction.ToAccount,transaction.Narrative,transaction.Amount]);
    })
}

function progressXml(fileData) {
    let xmlLines = fileData.split('SupportTransaction');
    for (var i = 1; i<xmlLines.length - 1; i = i + 2) {
        var data = xmlLines[i];
        data = data.split('>');
        var temp = [];
        temp.push(xmlDate(data[0].slice(7,data[0].length-1)))
        temp.push(data[7].slice(0,data[7].length-6));
        temp.push(data[9].slice(0,data[9].length - 4));
        temp.push(data[2].slice(0,data[2].length - 13));
        temp.push(data[4].slice(0,data[4].length-7));
        progress.progressTransaction(temp);
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
        progress.progressTransaction(temp);
    }
}

module.exports = {progressFile};
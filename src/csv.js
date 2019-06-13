const fs = require('fs');
const { parse } = require('json2csv');
const { fromPath } = require("fast-csv");
 
const FIELDS = ['authorDisplayName', 'textOriginal', 'publishedAt', 'videoId', 'authorChannelId']
let isEmpty = true

function clearFile(filename) {
    fs.writeFileSync(filename, '');
    isEmpty = true;
}

function appendData(filename, items) {
    const csv = parse(items, { fields: FIELDS, header: isEmpty });
    
    fs.appendFileSync(filename, `${csv}\n`, { encoding: 'utf-8' });
    isEmpty = false;
}

async function readData(filename) {
    const items = [];
    
    return new Promise((res, rej) => {
        fromPath(filename, { headers: FIELDS })
            .on("data", function(data){
                items.push(data);
            })
            .on("error", function(e){
                rej(e);
            })
            .on("end", function(){
                const [header, ...rest] = items;
                res(rest);
            });
    });
}


module.exports = {
    clearFile,
    appendData,
    readData
}
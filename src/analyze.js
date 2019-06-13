#!/usr/bin/env node
const { extract } = require('keyword-extractor');
const { readData } = require('./csv');
const { argv } = require('yargs');

const { input, lang = "english" } = argv;

void async function() {
    const comments = await readData(input);
    const allText = comments.map(c => c.textOriginal).join('\n');

    const keywords = extract(allText, {
        language: lang
    })
    
    console.log(keywords.join('; '))
}()
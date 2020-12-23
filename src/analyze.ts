#!/usr/bin/env node
import { extract } from 'keyword-extractor'
import { readData } from './csv'
import * as yargs from 'yargs'

const { input, lang = "english" } = yargs.options({
    input: {
        type: 'string',
        description: 'path to .csv file'
    },
    lang: {
        type: 'string',
        description: 'Language'
    }
  }).argv;

if (!input) throw new Error('')
if (!lang) throw new Error('')

void async function() {
    const comments = await readData(input);
    const allText = comments.map((c: any) => c.textOriginal).join('\n');

    const keywords = extract(allText, {
        language: lang
    })
    
    console.log(keywords.join('; '))
}()
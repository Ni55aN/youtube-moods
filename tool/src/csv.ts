import fs from 'fs'
import { resolve } from 'path'
import { youtube_v3 } from 'googleapis'
import { parse } from 'json2csv'
import { parseFile } from "fast-csv"
 
const FIELDS = ['authorDisplayName', 'textOriginal', 'publishedAt', 'videoId', 'authorChannelId']
let isEmpty = true

export type Row = Pick<youtube_v3.Schema$CommentSnippet, 'authorDisplayName' | 'textOriginal' | 'publishedAt' | 'videoId' | 'authorChannelId'>

export function clearFile(filename: string) {
    fs.writeFileSync(filename, '');
    isEmpty = true;
}

export function appendData(filename: string, items: Row[]) {
    const csv = parse(items, { fields: FIELDS, header: isEmpty });
    
    fs.appendFileSync(filename, `${csv}\n`, { encoding: 'utf-8' });
    isEmpty = false;
}

export async function readData(filename: string): Promise<Row[]> {
    const items: Row[] = [];
    
    return new Promise((res, rej) => {
        parseFile(filename, { headers: FIELDS })
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

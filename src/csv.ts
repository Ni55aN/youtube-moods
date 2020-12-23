import fs from 'fs'
import { parse } from 'json2csv'
import { parseFile } from "fast-csv"
 
const FIELDS = ['authorDisplayName', 'textOriginal', 'publishedAt', 'videoId', 'authorChannelId']
let isEmpty = true

export function clearFile(filename: string) {
    fs.writeFileSync(filename, '');
    isEmpty = true;
}

export function appendData<T>(filename: string, items: T[]) {
    const csv = parse(items, { fields: FIELDS, header: isEmpty });
    
    fs.appendFileSync(filename, `${csv}\n`, { encoding: 'utf-8' });
    isEmpty = false;
}

export async function readData<T>(filename: string): Promise<T[]> {
    const items: T[] = [];
    
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

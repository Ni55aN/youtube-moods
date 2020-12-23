import { extract } from './keyword-extractor'
import { readData } from './csv'

export  async function analyze(input: string, lang: string) {
    const comments = await readData(input);
    const allText = comments.map((c: any) => c.textOriginal).join('\n');

    const keywords = extract(allText, {
        language: lang
    })
    
    console.log(keywords.join('; '))
}
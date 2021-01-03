import franc from 'franc'
import { mean, median } from 'stats-lite'
import { SentimentAnalyzer, SentimentRecord } from './node-nlp'
import { readData } from './csv'

export  async function analyze(input: string, language: string) {
    const sentiment = new SentimentAnalyzer();

    const comments = await readData(input);
    console.log('comments: ', comments.length);
    
    const sentiments = await Promise.all(comments.map(async comment => {
        if (comment.textOriginal) {
            return await sentiment.getSentiment(comment.textOriginal, language)
        }
    }))
    const sentimentsScores = (sentiments.filter(s => s) as SentimentRecord[]).map(s => s.score)
    console.log('===\nSentiments:')
    console.log('mean: ', mean(sentimentsScores))
    console.log('median: ', median(sentimentsScores))
    console.log('number of positive: ', sentimentsScores.filter(s => s > 0).length)
    console.log('number of negative: ', sentimentsScores.filter(s => s < 0).length)

    const languages = comments.map(comment => ({
        comment,
        lang: comment.textOriginal ? franc(comment.textOriginal) : null
    }))
    const uniqueLangs = Array.from(new Set(languages.map(l => l.lang)))
    const langsUsage = uniqueLangs.map(lang => ({ lang, count: languages.filter(l => l.lang === lang).length }))
    langsUsage.sort((a,b) => b.count - a.count)

    console.log('===\nLanguages usage:')
    console.log(langsUsage.map(item => `${item.lang} -> ${item.count}`).join('\n'))
}
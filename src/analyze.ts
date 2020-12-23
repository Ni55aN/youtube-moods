import { SentimentAnalyzer, SentimentRecord } from './node-nlp'
import { mean, median } from 'stats-lite'
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
    
}
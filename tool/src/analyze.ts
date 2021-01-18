import franc from 'franc'
import { mean, median } from 'stats-lite'
import { SentimentAnalyzer, SentimentRecord } from './node-nlp'
import { readData } from './csv'
import { getDostoevskySentiments } from './dostoevsky';
import { getTokens, StanzaWord } from './stanza';

export  async function analyze(input: string, language: string) {
    const sentiment = new SentimentAnalyzer();

    const comments = await readData(input);
    console.log('comments: ', comments.length);
    
    // =============

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

    // =============

    const dostoevskySentiments = await getDostoevskySentiments(comments.map(comment => comment.textOriginal || ''))
    const dostoevskySentimentsScores = dostoevskySentiments.map(t => 'negative' in t ? -t.negative : ('positive' in t ? t.positive : 0))

    console.log('===\nDostoevsky Sentiments:')
    console.log('mean: ', mean(dostoevskySentimentsScores))
    console.log('median: ', median(dostoevskySentimentsScores))
    console.log('number of positive: ', dostoevskySentimentsScores.filter(s => s > 0).length)
    console.log('number of negative: ', dostoevskySentimentsScores.filter(s => s < 0).length)

    // =============

    const languages = comments.map(comment => ({
        comment,
        lang: comment.textOriginal ? franc(comment.textOriginal) : null
    }))
    const uniqueLangs = Array.from(new Set(languages.map(l => l.lang)))
    const langsUsage = uniqueLangs.map(lang => ({ lang, count: languages.filter(l => l.lang === lang).length }))
    langsUsage.sort((a,b) => b.count - a.count)

    console.log('===\nLanguages usage:')
    console.log(langsUsage.map(item => `${item.lang} -> ${item.count}`).join('\n'))

    // =============
    const messagesResponse = await getTokens(comments.map(comment => comment.textOriginal || ''))
    const words = messagesResponse.reduce((list, sentences) => {
        const words = sentences.reduce((words, s) => ([...words, ...s.words]), [] as StanzaWord[])
        return [...list, ...words]
    }, [] as StanzaWord[])

    const tokens = words.filter(w => !['DET', 'PUNCT', 'NUM'].includes(w.upos)).map(w => w.lemma)
    const keywords = Array.from(new Set(tokens))

    const keywordsFrequency = keywords.map(keyword => ({ word: keyword, count: tokens.filter(t => t === keyword).length }))

    keywordsFrequency.sort((a, b) => b.count - a.count)

    console.log(keywordsFrequency.slice(0, 100));

}
export type SentimentRecord = {
    score: number;
    numWords: number;
    numHits: number;
    average: number;
    type: string;
    locale: string;
    vote: string;
  }

export class SentimentAnalyzer {
  constructor()

  async getSentiment(text: string, locale?: string): Promise<SentimentRecord>
}
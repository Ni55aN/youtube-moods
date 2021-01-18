
import axios from 'axios'
import { chunk } from 'lodash'
import { number } from 'yargs';


export type StanzaWord = {
  id: number;
  text: string;
  lemma: string;
  upos: string;
  xpos: string;
  feats: string;
  head: number;
  deprel: string;
  deps: string;
  misc: string;
}
export type StanzaTextRecord = { text: string; words: StanzaWord[]}

export async function getTokens(messages: string[]): Promise<StanzaTextRecord[][]> {
  const responses = []
  const chunks = chunk(messages, 50)

  for (const chunk of chunks) {
    const res = (await axios.request<StanzaTextRecord[][]>({
        url: 'http://localhost:8889/tokens', method: 'POST', data: {
          messages: chunk
        }
      })).data

    try {
    responses.push(...res)
    } catch (e) {
      console.log(res, e)
    }
    console.log('loaded ', chunks.indexOf(chunk) + 1, '/', chunks.length, ' chunks');
  }

  return responses
}

import axios from 'axios'
import { chunk } from 'lodash'

export type DostoevskyRecord = ({ neutral: number } | { speech:number }) & ({ negative: number } | { positive: number } | { skip: number })

export async function getDostoevskySentiments(messages: string[]) {
  const responses = []
  const chunks = chunk(messages, 50)

  for (const chunk of chunks) {
    const res = (await axios.request<DostoevskyRecord[]>({
        url: 'http://localhost:8888/sentiments', method: 'POST', data: {
          messages: chunk
        }
      })).data

    responses.push(...res)
  }

  return responses
}
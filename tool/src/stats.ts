
import { google, youtube_v3 } from 'googleapis'
import { clearFile, appendData } from './csv'
import { retry } from './utils'

export async function stats(key: string, ids: string[]) {
    const youtube = google.youtube('v3')
    console.log('fetching..')
    
    const response = await youtube.videos.list({ key, id: ids, part: ['topicDetails', 'snippet', 'contentDetails', 'statistics'] })

    console.log(response.data.items?.map(item => ({
        id: item.id,
        title: item.snippet?.title,
        ...item.statistics
    })))

    console.log('Done')
}
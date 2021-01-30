
import { google, youtube_v3 } from 'googleapis'
import { clearFile, appendData } from './csv'
import { retry } from './utils'

async function getComments(key: string, videoId: string, pageToken: string | null): Promise<youtube_v3.Schema$CommentThreadListResponse> {
    const youtube = google.youtube('v3')
    try {
        const resp = await retry({
            retries: 5,
            fn: () => youtube.commentThreads.list({ videoId, maxResults: 100, part: ['snippet'], pageToken: pageToken || undefined, key }),
            log: () => console.log('Retry ', pageToken)
        })

        console.debug('got results ', resp.data.items?.length, '\nnext token ', resp.data.nextPageToken)
        return resp.data;
    } catch (e) {
        console.log('getComments failed: ', e);
        throw e
    }
}

export async function download(key: string, videoId: string, out: string, limit: number | null) {
    let token = null;
    let count = 0;
    
    clearFile(out);
    do {
        const data: youtube_v3.Schema$CommentThreadListResponse = await getComments(key, videoId, token);

        token = data.nextPageToken;
        
        const comments = (data.items || []).map(item => {
            return item.snippet?.topLevelComment?.snippet;
        }).filter(item => item) as youtube_v3.Schema$CommentSnippet[]

        count += comments.length;

        appendData(out, comments);
    } while(token && (limit === null || count < limit));

    console.log('Done')
}
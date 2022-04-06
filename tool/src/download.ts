
import { google, youtube_v3 } from 'googleapis'
import { clearFile, appendData } from './csv'
import { retry } from './utils'

async function getComments(key: string, videoId: string, pageToken: string | null): Promise<youtube_v3.Schema$CommentThreadListResponse> {
    const youtube = google.youtube('v3')
    try {
        const resp = await retry({
            retries: 5,
            fn: () => youtube.commentThreads.list({ videoId, maxResults: 100, part: ['snippet', 'replies'], pageToken: pageToken || undefined, key }),
            log: () => console.log('Retry ', pageToken)
        })

        console.debug('got results ', resp.data.items?.length, '\nnext token ', resp.data.nextPageToken)
        return resp.data;
    } catch (e) {
        console.log('getComments failed: ', e);
        throw e
    }
}

type Comment = { id?: string | null } & youtube_v3.Schema$CommentSnippet

export async function download(key: string, videoId: string, out: string, limit: number | null) {
    let token = null;
    let count = 0;

    clearFile(out);
    do {
        const data: youtube_v3.Schema$CommentThreadListResponse = await getComments(key, videoId, token);

        token = data.nextPageToken;

        const comments = (data.items || []).map(item => {
            return {
                id: item.id,
                ...item.snippet?.topLevelComment?.snippet,
                replies: item.replies?.comments?.map(item => ({ id: item.id, ...item.snippet })) || []
            }
        }).filter(item => item && item.replies)
        const flattenComments = comments.reduce((list, { replies, ...comment }) => ([...list, comment, ...replies]), [] as Comment[])

        count += flattenComments.length;

        appendData(out, flattenComments.map(item => ({
            ...item,
            textOriginal: item.textOriginal?.replace(/(\r|\n|\r\n)+/gm, '\\n')
        })));
        console.log('total loaded: ', count)
    } while(token && (limit === null || count < limit));

    console.log('Done')
}

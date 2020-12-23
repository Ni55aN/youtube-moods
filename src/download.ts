
import { google, youtube_v3 } from 'googleapis'
import { clearFile, appendData } from './csv'

async function getComments(key: string, videoId: string, pageToken: string | null): Promise<youtube_v3.Schema$CommentThreadListResponse> {
    const youtube = google.youtube('v3')
    const resp = await youtube.commentThreads.list({ videoId, part: ['snippet'], pageToken: pageToken || undefined, key })

    console.debug('got results ', resp.data.items?.length, '\nnext token ', resp.data.nextPageToken)
    return resp.data;
}

export async function download(key: string, videoId: string, out: string, limit: number | null) {
    let token = null;
    let count = 0;
    
    clearFile(out);
    do {
        const data: youtube_v3.Schema$CommentThreadListResponse = await getComments(key, videoId, token);

        token = data.nextPageToken;
        
        const comments = (data.items || []).map((item: any) => {
            let details = item.snippet.topLevelComment.snippet;
            
            return details
        });

        count += comments.length;

        appendData(out, comments);
    } while(token && (limit === null || count < limit));

    console.log('Done')
}
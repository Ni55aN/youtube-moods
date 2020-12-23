
import { google } from 'googleapis'
import { clearFile, appendData } from './csv'
import * as yargs from 'yargs'

const { key, out, videoId, limit = null } = yargs.options({
    key: {
        type: 'string',
        description: 'Youtube API key'
    },
    out: {
        type: 'string',
        description: 'Output .csv path'
    },
    videoId: {
        type: 'string',
        description: 'Video ID'
    },
    limit: {
        type: 'number',
        description: 'Limit'
    },
  }).argv;

if (!key) throw new Error('')
if (!out) throw new Error('')
if (!videoId) throw new Error('')

const getComments = async function(videoId: string, pageToken: string | null) {
    const youtube = google.youtube('v3')
    const resp = await youtube.commentThreads.list({ videoId, part: ['snippet'], pageToken: pageToken || undefined, key })

    console.debug('got results ', resp.data.items?.length, '\nnext token ', resp.data.nextPageToken)
    return resp;
}

void async function() {
    let token = null;
    let count = 0;
    
    clearFile(out);
    do {
        const data: any = await getComments(videoId, token);

        token = data.nextPageToken;
        
        const comments = data.items.map((item: any) => {
            let details = item.snippet.topLevelComment.snippet;
            
            return details
        });

        count += comments.length;

        appendData(out, comments);
    } while(token && (limit === null || count < limit));

    console.log('Done')
}();
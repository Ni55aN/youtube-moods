#!/usr/bin/env node
const { apiRequest } = require('./utils');
const { clearFile, appendData } = require('./csv');
const { argv } = require('yargs');

const { key, out, videoId, limit = null } = argv;

async function getComments(videoId, pageToken) {
    let resp = await apiRequest('commentThreads', {
        part: 'snippet',
        videoId,
        pageToken,
        key
    });

    console.debug('got results ', resp.items.length, '\nnext token ', resp.nextPageToken)
    return resp;
}

void async function() {
    let token = null;
    let count = 0;
    
    clearFile(out);
    do {
        const data = await getComments(videoId, token);

        token = data.nextPageToken;
        
        const comments = data.items.map(item => {
            let details = item.snippet.topLevelComment.snippet;
            
            return details
        });

        count += comments.length;

        appendData(out, comments);
    } while(token && (limit === null || count < limit));

    console.log('Done')
}();
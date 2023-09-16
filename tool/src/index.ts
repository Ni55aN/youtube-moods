import * as yargs from 'yargs'
import { analyze } from './analyze';
import { download } from './download';
import { stats } from './stats';

void async function() {
  const { command } = yargs.options({
    command: {
      choices: ['download', 'analyze', 'stats']
    }}).argv

    switch (command) {
      case 'download':
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
      
        if (!key) throw new Error('Key isnt defined')
        if (!out) throw new Error('output path isnt defined')
        if (!videoId) throw new Error('video id isnt defined')

        await download(key, videoId, out, limit)
      break;
      case 'analyze':
        const { input, lang = "english" } = yargs.options({
          input: {
              type: 'string',
              description: 'path to .csv file'
          },
          lang: {
              type: 'string',
              description: 'Language'
          }
        }).argv;

        if (!input) throw new Error('input path isnt defined')
        if (!lang) throw new Error('lang isnt defined')

        await analyze(input, lang);
      break;
      case 'stats':
        const { key: statsKey, ids: statsIds } = yargs.options({
          key: {
              type: 'string',
              description: 'Youtube API key'
          },
          ids: {
              type: 'string',
              description: 'List of videoIds'
          }
        }).argv;
      
        if (!statsKey) throw new Error('Key isnt defined')
        if (!statsIds) throw new Error('video id isnt defined')

        await stats(statsKey, statsIds.split(','))
      break;
    }
}()

# Youtube Moods

Tool for downloading and analyzing comments under YouTube videos

### Requirenments

- Docker
- Docker compose
- Node.js

### Setup

```bash
npm start
```

### Using

```bash
# download all comments
npm run download --prefix tool -- --key <Youtube API key> --out <path to csv file> --videoId <id from video url after ?v=>
# for downloading fist N comments append flag --limit N

# analyze text in csv file (extract all keywords from file in current version)
npm run analyze --prefix tool -- --input <path to csv file> --lang ru
```

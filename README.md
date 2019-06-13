# Youtube Moods

Tool for downloading and analyzing comments under YouTube videos

```bash
# download all comments
./src/download.js --key <Youtube API key> --out <path to csv file> --videoId <id from video url after ?v=>
# for downloading fist N comments append flag --limit N

# analyze text in csv file (extract all keywords from file in current version)
./src/analyze.js --input <path to csv file> --lang russian
```

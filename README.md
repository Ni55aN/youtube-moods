# Youtube Moods

Tool for downloading and analyzing comments under YouTube videos

```bash
# download all comments
npm run start -- --command download --key <Youtube API key> --out <path to csv file> --videoId <id from video url after ?v=>
# for downloading fist N comments append flag --limit N

# analyze text in csv file (extract all keywords from file in current version)
npm run start -- --command analyze  --input <path to csv file> --lang russian
```

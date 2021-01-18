import os
from eve import Eve
from flask import Flask, jsonify, make_response, request

import stanza

stanza.download('en')
nlp = stanza.Pipeline('en')

app = Eve()

@app.route('/tokens', methods=['POST'])
def get_tokens():
    body = request.get_json(force=True)
    messages = body['messages']

    return jsonify([[{
        "text": sent.text,
        "words": [{
            "text": word.text,
            "lemma": word.lemma,
            "head": word.head,
            "id": word.id,
            "upos": word.upos,
            "xpos": word.xpos,
            "feats": word.feats,
            "deps": word.deps,
            "misc": word.misc,
            "deprel": word.deprel
        } for word in sent.words]
        } for sent in nlp(message).sentences
    ] for message in messages])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
import os
from eve import Eve
from flask import Flask, jsonify, make_response, request
from sentiment import get_sentiments

settings = {
  'DOMAIN': {}
}

app = Eve(settings=settings)

@app.route('/sentiments', methods=['POST'])
def sentiments():
    body = request.get_json(force=True)
    messages = body['messages']

    return jsonify(get_sentiments(messages))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
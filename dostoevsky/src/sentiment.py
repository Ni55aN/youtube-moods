from dostoevsky.tokenization import RegexTokenizer
from dostoevsky.models import FastTextSocialNetworkModel

def get_sentiments(messages):

  tokenizer = RegexTokenizer()

  model = FastTextSocialNetworkModel(tokenizer=tokenizer)

  results = model.predict(messages, k=2)

  return results
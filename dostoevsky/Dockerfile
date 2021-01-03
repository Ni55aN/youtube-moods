FROM python:3.7

WORKDIR /code

RUN pip install eve
RUN pip install dostoevsky
RUN python -m dostoevsky download fasttext-social-network-model

COPY src/ .

CMD [ "python", "./index.py" ]
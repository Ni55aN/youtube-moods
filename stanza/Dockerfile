FROM python:3.7

WORKDIR /code

RUN pip install eve
RUN pip install stanza
RUN python -c 'import stanza; stanza.download("en")' 

COPY src/ .

CMD [ "python", "./index.py" ]
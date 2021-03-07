FROM python:alpine3.6

EXPOSE 5232

RUN python3 -m pip install -U pip \
    && python3 -m pip install --upgrade https://github.com/Kozea/Radicale/archive/master.tar.gz

CMD ["radicale"]
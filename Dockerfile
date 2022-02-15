FROM node:16.13.1-buster-slim

ENV NAME echarts
ENV USER echarts

RUN apt-get update -y && apt-get upgrade -y && \
    apt-get install -y libcairo2-dev libjpeg-dev libgif-dev libpango1.0-dev

RUN addgroup $USER && useradd -ms /bin/bash $USER -g $USER

RUN mkdir -p /opt/$NAME
COPY package.json /opt/$NAME/package.json
COPY yarn.lock /opt/$NAME/yarn.lock
RUN cd /opt/$NAME && yarn install

COPY config /opt/$NAME/config

WORKDIR /opt/$NAME

COPY --chown=$USER:$USER ./app /opt/$NAME/app

# Tell Docker we are going to use this ports
EXPOSE 3000

USER $USER

CMD [ "yarn", "start"]
# Dockerfile
FROM node:10
# Or whatever Node version/image you want
WORKDIR /var/www/app

RUN wget http://download.redis.io/redis-stable.tar.gz && \
    tar xvzf redis-stable.tar.gz && \
    cd redis-stable && \
    make && \
    mv src/redis-server /usr/bin/ && \
    cd .. && \
    rm -r redis-stable && \
    npm install -g concurrently   

EXPOSE 6379

#COPY package.json /app

RUN npm install

COPY . /var/www/app

EXPOSE 3000

CMD concurrently "/usr/bin/redis-server --bind '0.0.0.0'"
# Dockerfile
FROM node:10


#RUN wget http://download.redis.io/redis-stable.tar.gz && \
#    tar xvzf redis-stable.tar.gz && \
#    cd redis-stable && \
#    make && \
#    mv src/redis-server /usr/bin/ && \
#    cd .. && \
#    rm -r redis-stable && \
#    npm install -g concurrently   

# Install dependencies
WORKDIR /var/www/html
COPY package.json /var/www/html/package.json
#COPY package-lock.json /var/www/html/package-lock.json

# Copy Source Code
COPY public_html/api /var/www/html/

RUN npm cache clean --force && npm install

# Start app
#CMD concurrently "/usr/bin/redis-server --bind '0.0.0.0'"
#CMD [ "node", "/var/www/html/server.js" ]
CMD [ "npm", "run", "start" ]
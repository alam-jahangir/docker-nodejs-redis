# Node Js &amp; Redis Environment by Docker &amp; Docker-Compose 


``` Docker

Command: docker-compose up

### Run Redis Containr

redis:
    image: redis:alpine
    container_name: cache
    ports:
      - 6379:6379


### Run App Docker to setup environment
* Node (see Dockerfile)
* Npm
* Redis Server & Run Redis Server
## Run APP Docker Container
  app:
    build: ./
    volumes:
      - ./:/var/www/app
    links:
      - redis
    ports:
      - 3000:3000
    environment:
      - NODE_ENV=development
      - PORT=3000
      - REDIS_URL=redis://cache
    command:
      sh -c 'node server.js'

````

``` Node
### Root URL

URL: http://localhost:3000/

Output:
Redis & Node Js By Docker & Docker Compose

CODE:

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


````


``` Node

### Import Redis Client
const redisClient = require('./redis-client');

### Set Data in Redis By  URL

URL: http://localhost:3000/store/test?Test=test

CODE:
app.get('/store/:key', async (req, res) => {
    const { key } = req.params;
    const value = req.query;
    await redisClient.setAsync(key, JSON.stringify(value));
    return res.send('Success');
});

### Get Redis Data by Key

URL: http://localhost:3000/test

CODE:
app.get('/:key', async (req, res) => {
    const { key } = req.params;
    const rawData = await redisClient.getAsync(key);
    return res.json(JSON.parse(rawData));
});

````



``` Node
### Root URL

URL: http://localhost:3000/

Output:
Redis & Node Js By Docker & Docker Compose

CODE:

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


````
# Node Js with Redis using `docker-compose`

## Getting Started

### Command - `docker-compose up`

- Run Redis Containr

  ``` Dockerfile
  redis:
      image: redis:alpine
      container_name: cache
      ports:
        - 6379:6379

  ```

- Run App Docker to setup environment
  - Node (see Dockerfile)
  - Npm
  - Redis Server

  ``` Dockerfile
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

- Browse URL: http://localhost:3000/

  ``` js
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
  });
  ````

  ``` js
  // Import Redis Client
  const redisClient = require('./redis-client');
  ```

- Set Data in Redis By URL: http://localhost:3000/store/test?Test=test

  ```js
  app.get('/store/:key', async (req, res) => {
      const { key } = req.params;
      const value = req.query;
      await redisClient.setAsync(key, JSON.stringify(value));
      return res.send('Success');
  });
  ```

- Get Redis Data by Key URL: http://localhost:3000/test

  ```js
  app.get('/:key', async (req, res) => {
      const { key } = req.params;
      const rawData = await redisClient.getAsync(key);
      return res.json(JSON.parse(rawData));
  });

  ````
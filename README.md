# Node Js with Redis, Elasticsearch & Nginx using `docker-compose`

## Getting Started

### Command - `docker-compose up`

- Run Redis Container

  ``` Dockerfile
  redis:
      image: redis:alpine
      container_name: cache
      ports:
        - 6379:6379

  ```

- Run Elasticsearch Container

  ``` Dockerfile
  #Reference Link: https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html
  elasticsearch:
    container_name: elasticsearch
    #image: docker.elastic.co/elasticsearch/elasticsearch:6.1.1
    image: docker.elastic.co/elasticsearch/elasticsearch:6.6.0
    volumes:
      - ./es_data:/usr/share/elasticsearch/data
    environment:
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - discovery.type=single-node
    #  - cluster.name=docker-cluster
    ulimits:
        memlock:
          soft: -1
          hard: -1
    ports: 
      - 9201:9200

  ```
- Run Nginx Container to run frontend

  ``` Dockerfile
  frontend: # Nginx Server For Frontend App
    container_name: nginx
    image: nginx:latest
    volumes: # Serve local "public_html/web" dir
      - ./public_html/web:/usr/share/nginx/html
    ports:
      - 8888:80 # Forward site to localhost:8888 

  ```

- Run App Docker to setup environment
  - Node (see Dockerfile)
  - Npm
  - Redis Server

  ``` Dockerfile
    app:
    container_name: nodejs_app
    build: ./
    volumes:
      - ./public_html/api:/var/www/html
    links:
      - redis
      - elasticsearch
    ports:
      - 3000:3000
    environment:
      - NODE_ENV=development
      - PORT=3000
      - ES_HOST=elasticsearch
    #  - ES_PORT=9201
      - REDIS_URL=redis://redis_cache
    #command:
    #  sh -c 'node /var/www/html/server.js'
  ````

# API By Node Js

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


  ``` js
  // Import Elasticsearch Client
  app.use('/books', require('./routes/books'));
  var elastic = require('../elasticsearch');
  ```

- Delete if Books Index Exist and Create Books index Newly and Populate Data. 
- URL: http://localhost:3000/books/populate

  ```js
  // For Testing Purpose
router.get('/populate', function (req, res, next) {  
  
  elastic.indexExists().then(function (exists) {  
    
    if (exists) {
      return elastic.deleteIndex();
    }

  }).then(function () {
    
    return elastic.initIndex().then(elastic.initMapping).then(function () {
      var count = 1;  
      //var response = [];
      var promises = [
        'C',
        'C++',
        'Java',
        'GO',
        'Node JS',
        'Ruby',
        'Thing Explainer',
        'The Internet Is a Playground',
        'The Pragmatic Programmer',
        'The Hitchhikers Guide to the Galaxy',
        'Trial of the Clone'
      ].map(function (bookTitle) {
        
        //elastic.createFirstEntry();

        return elastic.addBook({
          id: count++,
          title: bookTitle,
          content: bookTitle + " content"
        });

      });

      //console.log(promises);  
      //var response1 = elastic.searchKeyword('Thing');
      ///console.log(response1);
      //res.json(response);

      return Promise.all(promises);

    });

  });

});

// Add Book to Index
async function addBook(book) {
    
    return await elasticClient.index({
        index: indexName,
        type: type,
        id: book.id,
        body: {
            title: book.title,
            content: book.content
        }
    });

}
exports.addBook = addBook;

// Update a Book Information
async function updateBook(book) {

    return  await client.update({
        index: indexName,
        type: type,
        id: book.id,
        body: {
            title: book.title,
            content: book.content
        }
    });

}
exports.updateBook = updateBook;
  ```

- Search Data From Books index of Elasticsearch. URL: http://localhost:3000/books/search/C  
``` js
router.get('/search/:input', function(req, res, next) {

  var data = elastic.searchKeyword(req.params.input);
  console.log(data);
  return data;
  
});


// Search Keyword
async function searchKeyword(term) {
    
    return await elasticClient.search({
        index: indexName,
        q: 'title:'+term
    });

    // Another Way
    /*return await client.search({
        index: indexName,
        body: {
            query: {
                match: {
                    title: term
                }
            }
        }
    });*/

}

OUTPUT:
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 2,
    "max_score": 0.9808292,
    "hits": [
      {
        "_index": "books",
        "_type": "book",
        "_id": "2",
        "_score": 0.9808292,
        "_source": {
          "title": "C++",
          "content": "C++ content"
        }
      },
      {
        "_index": "books",
        "_type": "book",
        "_id": "1",
        "_score": 0.80259144,
        "_source": {
          "title": "C",
          "content": "C content"
        }
      }
    ]
  }
}
  ```

# Web By PHP [ONGOING]

```nginx

URL: http://localhost:8888/test.html


```
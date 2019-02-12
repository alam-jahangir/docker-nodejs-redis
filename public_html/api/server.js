// server.js
const express = require('express');
const app = express();

// imports and app definition

//console.log(process.env.REDIS_URL);
// Redis
const redisClient = require('./redis-client');
app.get('/store/:key', async (req, res) => {
    const { key } = req.params;
    const value = req.query;
    await redisClient.setAsync(key, JSON.stringify(value));
    return res.send('Success');
});
app.get('/:key', async (req, res) => {
    const { key } = req.params;
    const rawData = await redisClient.getAsync(key);
    return res.json(JSON.parse(rawData));
});


// Elasticsearch
app.use('/books', require('./routes/books'));

app.get('/', (req, res) => {
    return res.send('Redis & Node Js By Docker & Docker Compose');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


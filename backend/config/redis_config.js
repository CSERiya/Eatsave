const redis = require('redis');

const client = redis.createClient({url: process.env.REDIS_URL});

client.on('error', err => console.log('Redis Client Error', err));
client.connect()
    .then(() => console.log("Connected to Redis via IPv4"))
    .catch((err) => console.error("Could not connect to Redis:", err));

module.exports = client;
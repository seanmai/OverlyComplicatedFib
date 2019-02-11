const keys = requires("./keys");
const redis = require("redis");

const redisClient = redis.creatClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

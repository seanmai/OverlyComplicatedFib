const keys = require("./keys");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Expresss
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgress
const { Pool } = require("pg");
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});
pgClient.on("error", function(){
    console.log("Lost Postgres connection.");
});
// Table setup
pgClient
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch(err => console.log(err));

const redis = require("redis");
const redisClient = redis.creatClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();         // Need duplication because redis cannot listen and publish at same time

// Routing
app.get("/", function(req, res){
    res.send("Hello world");
});

app.get("/values/all", async function(req, res){
    const values = await pgClient.query("SELECT * from values");
    res.send(values.rows);
});

app.get("/values/current", async function(req, res){
    redisClient.hgetall("values", function(err, values){
        res.send(values);
    });
});

app.post("/values", async function(req, res){
    const index = req.body.index;

    if(parseInt(index) > 40){                       // Algorithm is O(I), too slow for very large numbers
        return res.status(422).send(("Input too high."));
    }

    redisClient.hset("values", index, "Nothing yet");
    redisPublisher.publish("insert", index);
    pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

    res.send({ working: true });
});

app.listen(5000, function(){
    console.log("Listening on port 5000");
});

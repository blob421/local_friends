const Redis = require("ioredis");
const redis = new Redis({ host: "localhost", port: 6379 });
let Posts
const initMongoRoutes = () =>{
  const {mongoDb} = require('./mongo.js')
  const mongo = mongoDb.db('local_friends')
  Posts = mongo.collection('posts')
}

module.exports = {redis, Posts, initMongoRoutes}
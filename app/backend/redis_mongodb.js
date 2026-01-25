const Redis = require("ioredis");
let redis
if (!process.env.worker){
const runMode = process.env.runModeLocalFriends || 'Dev'
redis = runMode == 'Dev' ? new Redis({ host: "localhost", port: 6379 })
                               : new Redis({ host: "redis", port: 6379 })

}

let Posts
const initMongoRoutes = async () =>{
  const {mongoDb} = require('./mongo.js')
  const mongo = mongoDb.db('local_friends')
  Posts = mongo.collection('posts')
  await Posts.createIndex({ "User.id": 1, "Region.id": 1 })
}

const getPosts = () =>{
    if(Posts){
        return Posts
    }
}
module.exports = {redis, getPosts, initMongoRoutes}
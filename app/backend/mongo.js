const { MongoClient } = require("mongodb") 

const mongoMode = process.env.runModeLocalFriends
const mongoDb = mongoMode && mongoMode == 'Prod' ? new MongoClient("mongodb://mongo:27017")
                                                 : new MongoClient("mongodb://localhost:27017")


module.exports = {mongoDb}
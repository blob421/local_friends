const { MongoClient } = require("mongodb") 
const mongoDb = new MongoClient("mongodb://localhost:27017");

module.exports = {mongoDb}
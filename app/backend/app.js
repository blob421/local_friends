const { sequelize, User, Region } = require('./db.js');
const {mongoDb} = require('./mongo.js')
const {connectRabbit, getChannel} = require('./rabbit.js')

require('dotenv').config();

const express = require('express');
const app = express();
const runMode = process.env.runModeLocalFriends || 'Dev'

const cors = require('cors')
const cookieParser = require('cookie-parser');
const queryInterface = sequelize.getQueryInterface();

// Middleware///////////////////////////////////////////////////////////////////
const authenticateToken = require('./jwt_middleware');

app.use(express.json({limit: '10MB'}));
app.use(cors({ origin: process.env.FRONT_END_URL, credentials: true }));
const bcrypt = require('bcrypt');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (runMode == 'Dev'){
app.use('/home/blob421/dev/Projects/local_friends/media/', 
         express.static('/home/blob421/dev/Projects/local_friends/media/'));

}
else {
app.use('/usr/src/app/media', express.static('/usr/src/app/media'));

}

/////////////////////////////// RATE LIMITER ///////////////////////////////////
const {rateLimit} = require('express-rate-limit')
const limit = rateLimit({windowMs: 1000 * 60,
                         limit: 50,
                         legacyHeaders: false,
                         standardHeaders: 'draft-8', /// newest
                          ipv6Subnet: 64, // first 64 digits same subnet

})
app.use(limit)
app.set('trust proxy', 1); // for nginx or real ips instead of the proxy

////////////////////////////// GRAPHQL /////////////////////////////////////////
const { createHandler } = require('graphql-http/lib/use/express');
const { schema } = require("./graphql/Schema.js");


const { renderGraphiQL } = require('@graphql-yoga/render-graphiql');;

app.get('/graphql', (req, res) => {
  res.send(renderGraphiQL({ endpoint: '/graphql' }));
});

app.use(
  "/graphql",
  authenticateToken,   
                                                                    
  createHandler({
    schema,
    graphiql: true
  })
);

/////////////////////////////// MAIN LOOP //////////////////////////////////////
async function main() {

  await sequelize.authenticate();
  console.log('Database connected');
  // Make sure tables exist
   //await sequelize.sync({alter: true});
  console.log('Database synced');

  await queryInterface.sequelize.query(`
  CREATE EXTENSION IF NOT EXISTS pg_trgm;
  CREATE INDEX IF NOT EXISTS regions_name_trgm_idx
  ON "Regions"
  USING gin (name gin_trgm_ops);

  CREATE INDEX IF NOT EXISTS addresses_street_idx ON "Addresses" USING gin (street gin_trgm_ops);
 
`);

  await connectRabbit()
  await mongoDb.connect()
   const {router} = require('./routes')
   const {initMongoRoutes} = require('./redis_mongodb.js')
  await initMongoRoutes()
  
 
  app.use('/', router);

  app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

  

  const super_exists = await User.findOne({where: {username:'gabri'}})
  if (!super_exists){


  // Create an instance
  let password = 'password'
  

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({username: 'gabri', firstName: 'Gabriel', 
  lastName: 'B', password:hashedPassword, email: 'gabrielbpoitras@gmail.com'});

  

  console.log(newUser.toJSON());

  // Query instances
  const users = await User.findAll();
  console.log(users.map(u => u.toJSON()));
    }


 
}
main();




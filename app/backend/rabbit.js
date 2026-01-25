const amqp = require('amqplib')
let channel 

async function connectRabbit(){
  const runMode = process.env.runModeLocalFriends || 'Dev'
  const connection = runMode == 'Dev' ? await amqp.connect('amqp://guest:guest@localhost:5672')
                                      : await amqp.connect('amqp://admin:secret@rabbitmq:5672')
 
 //const connection = 
  channel = await connection.createChannel()
  await channel.assertQueue('detect_animal', {durable: true})
  await channel.assertQueue('stats_checking', {durable: true} )
  
}

async function getChannel(){
  if (!channel)
  {throw new Error('Channel doesnt exists')}
  
   return channel
}

module.exports = {connectRabbit, getChannel}


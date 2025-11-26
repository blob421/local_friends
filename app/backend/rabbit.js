const amqp = require('amqplib')
let channel 

async function connectRabbit(){
  //const connection = await amqp.connect('amqp://admin:secret@rabbitmq:5672')
 const connection = await amqp.connect('amqp://admin:secret@localhost:5672')
  channel = await connection.createChannel()
  await channel.assertQueue('detect_animal', {durable: true})
  
}

async function getChannel(){
  if (!channel)
  {throw new Error('Channel doesnt exists')}
  
   return channel
}

module.exports = {connectRabbit, getChannel}


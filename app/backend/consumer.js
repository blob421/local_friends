
const {getChannel} = require('./rabbit')
const {Post} = require('./db')
async function consume(){
    const channel = await getChannel()
    queueName = 'results_animal'
    await channel.assertQueue(queueName, {durable: true})
    await channel.consume(queueName, async msg => {
      if(msg){

        try {
            const data = JSON.parse(msg.content.toString())
            const post = await Post.findOne({where: {id: data.postId}})
            post.guessed_animal = data.prediction
            await post.save()
            channel.ack(msg)

         }catch(err){
            console.log(err)
         }
      }
    })

}

module.exports = {consume}
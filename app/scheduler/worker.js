const amqp = require('amqplib')
const { Sequelize, Op } = require("sequelize");
const {User, Post, UserStat} = require('../backend/db')



async function listen_animal_results(channel){
   
    const queueName = 'results_animal'
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
async function check_stats(channel){
   setInterval(async () => {
     const users = await User.findAll()
     const now = new Date();
     const twoHoursAgo = new Date(now.getTime() - 1000 * 60 * 60 * 2);
    
     for (const user of users){
        const userStat = await UserStat.findOne({where: {UserId: user.id}})
        const posts = await Post.findAll({where: {UserId: user.id, 
                                            createdAt: {
                                                   [Op.between]: [twoHoursAgo, now]
                                    }},
                                    })
        let valid_animals_detected = 0 

        posts.forEach(post=>{
           if(post.guessed_animal){
                valid_animals_detected += 1
           }
        });

        userStat.found += valid_animals_detected
        await userStat.save()
     }
 
   },1000 * 60 * 60 * 2 ) // 2 hours
}


async function main(){
    //////////INIT DB
    const sequelize = new Sequelize('postgres://postgres:1246@db:5432/js-backend');
    await sequelize.authenticate()
    await sequelize.sync({alter:true})


    //////////INIT RABBITMQ
    const connection = await amqp.connect('amqp://admin:secret@localhost:5672')
    const channel = await connection.createChannel()


    check_stats(channel)
    listen_animal_results(channel)
}

main()
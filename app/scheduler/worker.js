const amqp = require('amqplib')
const { Sequelize, Op, where } = require("sequelize");
const {User, Post, UserStat, UserBadge, Badge, Followed} = require('../backend/db')



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
     const badges = await Badge.findall({ order: [['id', 'ASC']] })

     
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
        const userBadge = UserBadge.findAll({where: {UserId: user.id}})
        
        const ObtainedBadges = userBadge.map(b=>{
          b.BadgeId
        })
        ///////////////////////// ANIMALS FOUND ////////////////////////////////

        if (userStat.found > 0 && !ObtainedBadges.includes(badges[0].id)){
           await userBadge.create({BadgeId: badges[0].id, UserId: user.id})
        }
        else if (userStat.found > 4 && !ObtainedBadges.includes(badges[1].id)){
          await userBadge.create({BadgeId: badges[1].id, UserId: user.id})
        }
         else if (userStat.found > 24 && !ObtainedBadges.includes(badges[2].id)){
          await userBadge.create({BadgeId: badges[2].id, UserId: user.id})
        }
         else if (userStat.found > 49 && !ObtainedBadges.includes(badges[3].id)){
          await userBadge.create({BadgeId: badges[3].id, UserId: user.id})
        }
         else if (userStat.found > 99 && !ObtainedBadges.includes(badges[4].id)){
          await userBadge.create({BadgeId: badges[4].id, UserId: user.id})
        }
         else if (userStat.found > 199 && !ObtainedBadges.includes(badges[5].id)){
          await userBadge.create({BadgeId: badges[5].id, UserId: user.id})
        }
        
         ///////////////////////// FOLLOWERS /////////////////////////////////////

         const followers = await Followed.findAll({where: {followingId: user.id}})

         if (followers.length > 19 && !ObtainedBadges.incudes(badges[6].id)){
             await userBadge.create({BadgeId: badges[6].id, UserId: user.id})
         }
         else if (followers.length > 99 && !ObtainedBadges.incudes(badges[7].id)){
             await userBadge.create({BadgeId: badges[7].id, UserId: user.id})
         }
         else if (followers.length > 999 && !ObtainedBadges.incudes(badges[8].id)){
             await userBadge.create({BadgeId: badges[8].id, UserId: user.id})
         }
      }
 
   },1000 * 60 * 60 * 2 ) // 2 hours
}


async function main(){
    //////////INIT DB
    const sequelize = new Sequelize('postgres://postgres:1246@db:5432/js-backend');
    await sequelize.authenticate()



    //////////INIT RABBITMQ
    const connection = await amqp.connect('amqp://admin:secret@localhost:5672')
    const channel = await connection.createChannel()


    check_stats(channel)
    listen_animal_results(channel)
}

main()
const {redis, Posts} = require('./redis_mongodb')
const {Followed} = require('./db')


async function fetchPosts(Posts, req, cached, region){
    let posts
    let query_follow
    let query_main
    const userId = req.user.id
    let seenObjectIds

    const seen = await redis.smembers(`seen:${userId}`);
    if (cached){
      
        seenObjectIds = seen.map(id => new ObjectId(id));
    }


    const followed = await Followed.findAll({where: {followerId: req.user.id}})  

          const arr = followed.map(follow => follow.followingId)

          const followedPostsNested = await Promise.all(
            arr.map(async userId => {
              if(!cached){
                    query_follow = region
                            ? { "User.id": userId, "Region.id": region }
                            : { "User.id": userId };

              }else{
                    query_follow = region
                            ? { "User.id": userId, "Region.id": region, _id: {$nin: seenObjectIds } }
                            : { "User.id": userId, _id: {$nin: seenObjectIds }};
              }
     
              return Posts
                .find(query_follow)
                .sort({ id: -1 })
                .limit(4)
                .toArray();
            })
          );

          const followedPosts = followedPostsNested.flat();

          if (!cached){
             query_main = region ? { "Region.id": region}: {}
          }
          else{
             query_main = region ? { "Region.id": region, _id: {$nin: seenObjectIds}}: {_id: {$nin: seenObjectIds }}
          }
        
          const mainstreamPosts =  await Posts
                                             .find(query_main)
                                             .sort({id: -1})
                                             .limit(5)
                                             .toArray()

        const personalizedPosts = [...mainstreamPosts, ...followedPosts]
        const uniquePosts = Array.from(
        new Map(personalizedPosts.map(post => [post.id, post])).values()
      );

      posts = uniquePosts.sort(() => Math.random() - 0.5);
      if(seen.length == 0){
        const posts_ids = posts.map(p=> p._id.toString())
        await redis.sadd(`seen:${userId}`, posts_ids)
      }

      return posts
}

module.exports = {fetchPosts}
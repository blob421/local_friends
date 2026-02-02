

//////////////////REDIS///////////////////
const {redis} = require('./redis_mongodb.js')
const {getPosts} = require('./redis_mongodb.js')
const { ObjectId } =  require("mongodb");
////////////////  Utilities  /////////////////
const {fetchPosts} = require('./fetch_stuff.js')
//////////////////////////////////////////////

const express = require('express');
const bcrypt = require('bcrypt'); // for password hashing
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const {getChannel} = require('./rabbit')


/////////////////////////////////////////////////////

const { User, Team, Badge, Region, Animal
  , Addresses, Followed , UserBadge,
  UserStat,
  UserSettings, sequelize} = require('./db');



const router = express.Router();
router.use(express.json());

const authenticateToken = require('./jwt_middleware');

//////////////////// FILE STORAGE ///////////////////
const multer = require('multer')
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({ 
destination: (req, file, cb) => {
  fs.mkdirSync(path.join('/', 'usr', 'src', 'app', 'media'), {recursive: true})
  cb(null, path.join('/', 'usr', 'src', 'app', 'media'))
}, 

filename: (req, file ,cb) => {
  cb(null, Date.now() + path.extname(file.originalname));
}
})

const storageUser = multer.diskStorage({ 
destination: (req, file, cb) => {
  const uploadPath = path.join('/', 'usr','src','app', 'media' ,'user', String(req.user.id))
  fs.mkdirSync(uploadPath, { recursive: true });
  cb(null, uploadPath)
}, 

filename: (req, file ,cb) => {
  cb(null, Date.now() + path.extname(file.originalname));
}
})

const upload = multer({ storage : storage });
const uploadUser = multer({storage : storageUser})


const handlePost = async (files, post, data, userId) => {
  const Posts = getPosts()
  let postId = null
  try {
    let media_arr = [];
    if (files && files.length > 0) {
      

      files.forEach((file, idx) => {
        media_arr.push({
          idx,
          filename: file.filename,
          mimeType: file.mimetype,
          url: file.path
        });
      });
   
     !data ? post.Media = media_arr : ""
     
    }else{

      if (data){
           media_arr = post.Media
      }
      else{
           post.Media = new Array
      }
     
    }
      if (data){
        console.log(data)

        const longitude = data.longitude ? data.longitude : post.longitude
        const latitude = data.latitude ? data.latitude : post.latitude
        const status=  await Posts.updateOne({_id: post._id, "User.id": parseInt(userId)}, 
          {$set : {Media: media_arr, 
                   longitude: longitude, 
                   latitude: latitude,
                   content: data.content,
                   title: data.title
                  }, 

        }
        )
        console.log(status)
        if (!status.acknowledged){
          console.log('post not modified in MongoDb err')
        }
       
    
      }
      else{
            const status = await Posts.insertOne(post);
            console.log(status)
            if (!status.acknowledged) {
              console.log('Insert failed mongodb, handlefiles');

            }else{
           
              postId = status.insertedId.toString()
            }
      }



      const channel = await getChannel();

      media_arr.forEach(media => {
        const payload = JSON.stringify({
          path: media.url,
          postId: postId? postId: post._id.toString(),
          userId: userId,
          arr_idx: media.idx
        });

        channel.sendToQueue('detect_animal', Buffer.from(payload));
      });
    
  } catch (err2) {
    console.log(err2);
  }
};

//////////////////// AUTH ///////////////////////////

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });


    const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '2d' } 
  );

   res.cookie('jwt', token, {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 1000 * 2,
  });
  res.redirect(`${process.env.FRONT_END_URL}/dashboard`);
});

router.get('/profile/:id', authenticateToken, async (req, res)=>{
  const targetId = req.params.id
  const settings = await UserSettings.findOne({where: {UserId: req.params.id}})
  const attr = settings.showEmail
  ? { exclude: [] }
  : { exclude: ['email'] };
  

   const badges = await Badge.findAll()
   const UserBadges = await UserBadge.findAll({where: {UserId: targetId}})
   
   const stats = await UserStat.findOne({where: {UserId: targetId}})

                                
 
  const user = await User.findOne({where: {id: req.params.id},
                             attributes : attr,
                             include: [
                                {
                                  model: Region,
                                  attributes: ['name', 'id']
                                },
                                {
                                  model: Animal,
                                  attributes: ['name', 'picture', 'description']
                                }
                              ]})
           
  const following = await Followed.findOne({where: {followerId: req.user.id, followingId: req.params.id}})

  const req_user = req.user.id
  res.json({user, settings, req_user: req_user, following:following !== null, stats, badges, UserBadges})
})


router.post('/unfollow/user/:id', authenticateToken, async (req, res)=>{
  const userid = req.params.id
  try {
     await Followed.destroy({where: {followerId: req.user.id, followingId: userid}})
     const Stats = await UserStat.findOne({where: {UserId: userid}})
     const Stats2 = await UserStat.findOne({where: {UserId: req.user.id}})
     Stats.followers -= 1
     Stats2.following -= 1
     await Stats.save()
     await Stats2.save()
      res.sendStatus(200)
  }catch(err){
    res.sendStatus(404)
  }

})

router.get('/get_followers', authenticateToken, async (req, res)=>{
  const userId = req.user.id
  
  let follower_list = []
  let followed_list = []
  const followed = await Followed.findAll({where: {followerId: userId}})
  const followers = await Followed.findAll({where: {followingId: userId}})
  followed.map(f=>{
       followed_list.push(f.followingId)
    }
  )
  followers.map(f=>{
       follower_list.push(f.followerId)
    }
  )
    const users_follower = await User.findAll({where: {id: {[Op.in]: follower_list}}})
    const users_followed = await User.findAll({where: {id: {[Op.in]: followed_list}}})
  
   res.json({users_followed, users_follower})




})
router.post('/follow/:target_user', authenticateToken, async (req, res)=>{
  const params = req.params
  console.log(params.target_user)
  try {
      const target_user = parseInt(params.target_user)
      
      await Followed.create({followerId: req.user.id, followingId: target_user})

      const Stats = await UserStat.findOne({where: {UserId: req.user.id}})
      const Stats2 = await UserStat.findOne({where: {UserId: target_user}})
      Stats.following += 1
      Stats2.followers += 1
      await Stats.save()
      await Stats2.save()
      res.sendStatus(200)
      
  }catch(err){
    console.log(err)
    res.sendStatus(400)
  }
})


router.get('/dashboard/posts/:UserId', authenticateToken, async (req, res) =>{
  const userId = parseInt(req.params.UserId)
  const Posts = getPosts()
  const userPosts = await Posts.find({"User.id": userId}).sort({id: -1}).toArray()

  res.json({posts: userPosts})
})


router.get('/dashboard', authenticateToken, async (req, res) => {
   const user = await User.findOne({where:{id: req.user.id},
  include: [
    {
    model: Region,
    attributes: ['name', 'id'] 
    }, 
    {
    model:Animal,
    attributes : ['name', 'picture', 'description']
    }
]})
   const badges = await Badge.findAll()
   const UserBadges = await UserBadge.findAll({where: {UserId: req.user.id}})
   const teams = await Team.findAll()
   const [settings, created_settings] = await UserSettings.findOrCreate({where: {UserId: user.id}, defaults: { UserId: user.id }})
   const [stats, created] = await UserStat.findOrCreate({ where: { UserId: user.id }, defaults: { UserId: user.id }})
                                
   res.json({user, teams, settings, stats, badges, UserBadges})
});

router.post('/register', async (req, res) => {
  const data = req.body
  const hashed = await bcrypt.hash(data.password, 10)
  const existingUser = await User.findOne({where:{username: data.username}})
  const existingEmail = await User.findOne({where:{email: data.email}})
  if (existingUser){
    return res.redirect(
   `${process.env.FRONT_END_URL}/registration?error=username_exists&username=${encodeURIComponent(
    data.username)}&email=${encodeURIComponent(data.email)}`);

  }
  if (existingEmail){
    return res.redirect(
   `${process.env.FRONT_END_URL}/registration?error=email_exists&username=${encodeURIComponent(
    data.username)}&email=${encodeURIComponent(data.email)}`);
  }

  const newUser = await User.create({username: data.username, password: hashed, 
    email:data.email})
  await UserSettings.create({UserId: newUser.id})
  await UserStat.create({UserId: newUser.id})
  const token = jwt.sign({id: newUser.id, username: newUser.username},
    process.env.JWT_SECRET, 
    {expiresIn: '2d'}
  )
  res.cookie('jwt', token, {
    maxAge:  60 * 60 * 24 * 1000 * 2,
    sameSite: 'lax',
    secure: false,
    httpOnly: true
  }) 
  res.redirect(`${process.env.FRONT_END_URL}/dashboard`)
})

////////////////////////////// POST ////////////////////////////////////
router.post('/post', authenticateToken,
                     upload.array('images', 5) ,
  async (req, res) => {
 

  const data = req.body
  
  const user = await User.findOne({where: {id: req.user.id}})

  const [post_idx] = await sequelize.query( `INSERT INTO "Posts" DEFAULT VALUES RETURNING id` ); 
  const postId = post_idx[0].id;
  const region = Region.findOne({where: {id: user.RegionId}})

  const post = {id: postId ,title: data.title, content: data.content, 
                Region: {id: user.RegionId, display_name: region.display_name}, 
                User: {id: user.id, username:user.username, picture:user.picture}, 
                longitude: data.longitude, latitude: data.latitude, Comments:[], SubComments:[],
                guessed_animal: null, createdAt: new Date()}



  const files = req.files
  await handlePost(files, post, null, null)
 

    res.redirect(`${process.env.FRONT_END_URL}/home`)
})


// SHOWS POSTS OF FOLLOWING WHEN REFRESHING THE MAIN ROUTE , ENSURE NEWEST POSTS AND NEW POSTS
router.get('/home', authenticateToken, async (req, res) =>{
  const userId = req.user.id
  const user = await User.findOne({where: {id: userId},
                                  include: [{model: UserSettings}]})
 
  const scope = req.query.scope
  let region
  let posts
 
    if (scope && scope === 'world'){
       region = null
    }
    else if (scope  && scope === 'region'){
        region = user.RegionId
    } 

    else{
        region = user.UserSetting.postScopeRegion ? user.RegionId : null
       }    

     posts = await fetchPosts(req, true, region)

     if (posts.length < 5){
      await redis.del(`seen:${userId}`);
      posts = await fetchPosts(req, false, region)
    
     }


     res.json({posts, user: user, settings: user.UserSetting, region: region})
    }
  )

//// CACHES SEEN POSTS AND FETCH MORE POSTS FOR THE FEED 
router.post('/more_posts/:feed/:regionId', authenticateToken, async (req, res)=>{
  const data = req.body.ids
  const userId = req.user.id
  const Posts = getPosts()
  console.log(req.body)
  const feed = req.params.feed
  const regionId = req.params.regionId
  const region = feed === 'Region'
  let posts
  try{


  await redis.sadd(`seen:${userId}`, ...data); 
  await redis.expire(`seen:${userId}`, 60 * 120);

  const seen = await redis.smembers(`seen:${userId}`);
  const seenObjectIds = seen.map(id => new ObjectId(id));
 
  const query = region
  ? { "Region.id": regionId, _id: { $nin: seenObjectIds } }
  : { _id: { $nin: seenObjectIds } };
  
  posts = await Posts.find(query).sort({id: -1}).limit(15).toArray()
  if (posts.length < 5){

     await redis.del(`seen:${userId}`);
     posts = await fetchPosts(req, false, region)
  }
 }catch(err){
  console.log(err)
 }
 if (posts){
 res.json({posts})

 }else{
  res.sendStatus(400)
 }
 
})
router.get('/images', async (req, res)=>{

})
router.post('/comment/delete/', authenticateToken, async (req, res)=>{
  const Posts = getPosts()
  const data = req.body
  console.log(data)
  const commentId = data.commentId
  const commentType = data.commentType
  const postId = data.postId
  let merged
  try{
    const post = await Posts.findOne({_id: new ObjectId(postId)})

 

    if (commentType == "Comments"){
      if(post.SubComments && post.SubComments.length > 0){
          const subToDelete = post.SubComments.filter(s=> s.CommentId == commentId)
                                        .map(s => s.id)
          const subSubToDelete = post.SubComments.filter(ss => subToDelete.includes(ss.ParentId))
                                           .map(ss => ss.id)

          merged = [...subToDelete, ... subSubToDelete]
}else{
  merged = []
}
      await Posts.updateOne(
          {_id: new ObjectId(postId)},
          {
          $pull:{
            "Comments": {id: parseInt(commentId) },
            'SubComments': { id: {$in: merged}},
           
          }
        
          }
        )
    }
    else if (commentType == 'SubComments'){
     const subSubToDelete = Array.from(post.SubComments.filter(ss => ss.ParentId == commentId)
                             .map(ss => ss.id))
     merged = [...subSubToDelete, commentId];
     await Posts.updateOne(
       {_id: new ObjectId(postId)},
          {
          $pull:{
            'SubComments': { id: {$in: merged}},
           
          }
        
          }
)}

}catch(err){
  
    console.log(err)
    res.sendStatus(404)
  }
  res.json({subComments: merged})
})


router.post('/post/:id/comment/',authenticateToken, async (req, res) => {
  const postId = req.params.id
  const Posts = getPosts()
  
  const data = req.body
  console.log(data)
  const user = await User.findOne({where: {id: req.user.id}})
  console.log(user)
  const parentSubcomment = parseInt(data.parentSub)
  const parentComment = parseInt(data.parent)
  let commentId

  let query_str
  parentComment || parentSubcomment ? query_str = "SubComment":  query_str = "Comment"
     

  const [comment_idx] = await sequelize.query(`INSERT INTO "${query_str}" DEFAULT VALUES RETURNING id` ); 
  const CommentId = comment_idx[0].id;
try{
  if (parentComment){
 
    await Posts.updateOne(
  { _id: new ObjectId(postId) },
  {
    $push: {
      SubComments: {
        id: CommentId,
        CommentId: parentComment,
        User: { id: user.id, username: user.username, picture: user.picture },
        content: data.comment,
        createdAt: new Date()
      }
    }
  }
);
    commentId = `subcomment_${CommentId}`
  }
  else if (parentSubcomment){
 await Posts.updateOne(
    { _id: new ObjectId(postId) },
  {
    $push: {
      SubComments: {
        id: CommentId,
        ParentId: parentSubcomment,
        User: { id: user.id, username: user.username, picture: user.picture },
        content: data.comment,
        createdAt: new Date()
      }
    }
  }
);
     commentId = `subsub_${CommentId}`
  } 
  else{
    await Posts.updateOne(
      { _id: new ObjectId(postId) },
    {
      $push: {
        Comments: {
          id: CommentId,
          User: { id: user.id, username: user.username, picture: user.picture },
          content: data.comment,
          createdAt: new Date(),
          
        }
      }
    }
  );
}}catch(err){
  res.sendStatus(304)
}
res.json({id: CommentId, parentId: parentSubcomment, commentId:parentComment})
  

})
router.delete('/post/region/:regionId/id/:id', authenticateToken, async (req, res)=>{
  const id = req.params.id
  const regionId = req.params.regionId
  const Posts = getPosts()
 try{
  
   const status = await Posts.deleteOne({_id: new ObjectId(id), "User.id": req.user.id})
   await redis.zrem(`region:${regionId}`, id)
   if (status.deletedCount === 1){
       res.sendStatus(202)
   }else{
       res.sendStatus(401)
   }
  
  }
  catch(err){
    res.sendStatus(500)
  }
})
router.post('/post/edit/:id', authenticateToken, upload.array('images', 5), async (req, res)=>{
  const id = req.params.id
  const data = req.body
  const Posts = getPosts()
  const post = await Posts.findOne({_id: new ObjectId(id)})


  // Delete old photos to replace them 
  if (req.user.id === post.User.id){
    const files = req.files
    if (files.length > 0){
     const photos = post.Media
     
     for (const photo of photos){
      fs.unlink(photo.url, (err)=>{
        if (err){
          console.log(err)
        }
      })
     
     }
     
        
    
        
     }
     await handlePost(files, post, data, req.user.id)
     
     res.redirect(`${process.env.FRONT_END_URL}/home?post=${post.id}`)
  }
})
///////////////////////////// PROFILE //////////////////////////////////
router.post('/profile/edit', authenticateToken, uploadUser.single('image'), 
async (req, res)=>{
 const file = req.file
 const data = req.body
 const user = await User.findByPk(req.user.id)
 let username_exists

 if (file){
  
  if(user.picture){
    
    fs.unlink(user.picture, (err)=>{
      if (err){
        console.log(err);
        return
      }
     
      
    })
  }
  user.picture = file.path
  }
   console.log(data)
  if (data.username){
    const exists = await User.findOne({where:{username: data.username}})
    if (exists){
      username_exists = true
    }
    user.firstName = data.firstName
  }
  if (data.region){
    
    user.RegionId = parseInt(data.region)
  }
  if (data.firstName){
    user.firstName = data.firstName
  }
   if (data.lastName){
    user.lastName = data.lastName
  }
  if (data.password){
    user.password = await bcrypt.hash(data.password, 10)
    
  }
  if (data.email){
    user.email = data.email
  }
  if (data.animal_select){
    const animal = await Animal.findOne({where: {name: data.animal_select}})
    user.AnimalId = animal.id
    await user.save()
    res.redirect(`${process.env.FRONT_END_URL}/dashboard`)

  }else{
    await user.save()
    if (username_exists){
    res.redirect(`${process.env.FRONT_END_URL}/dashboard?modal=true&username=false`)
  }
  res.redirect(`${process.env.FRONT_END_URL}/dashboard?modal=true`)
 }
  }
  
 
)

router.post('/user_settings/edit/:firstLogin', authenticateToken, async (req, res)=>{
  const data = req.body
  const first_login = req.params.firstLogin
  console.log(data)
  const settings = await UserSettings.findOne({where: {UserId: req.user.id}})
    if (first_login == 'true'){
       settings.firstLogin = false
       await settings.save() 
       res.sendStatus(200)
    } 
    if (data){
    data.email ? settings.showEmail = true : settings.showEmail = false
    data.postScope ? settings.postScopeRegion = true: settings.postScopeRegion = false
      await settings.save() 
       res.redirect(`${process.env.FRONT_END_URL}/dashboard`)
    }

  
    

})
//////////////////////////////// REGIONS API ////////////////////////////////////////

router.get('/regions', authenticateToken, async (req, res)=>{
  const search = req.query.name
  const results = await Region.findAll({attributes: ['name', 'id'] ,
                                  where:{name: {[Op.iLike]: `${search}%`} }, 
                                  distinct: true,
                                  group: ['name', 'id'],
                                  limit: 20})
  res.json({results})
} )
router.get('/street_addresses', authenticateToken, async (req,res)=>{
  const search = req.query.name
  const number =  search.match(/\d+/g);
  const string = search.replace(/\d+/g, "").trim();
  const results = await Addresses.findAll({ where:{[Op.and] : [
                                                         {street:{[Op.iLike]: `${string}%`}},
                                                         {number:{[Op.iLike]: `${number? number: ""}%`}}
                                                        ]
                                                      },
                                    
                                            limit: 20})
  res.json({results})
})
router.get('/animals', authenticateToken, async(req, res)=>{
  const search = req.query.name
  const results = await Animal.findAll({attributes: ['name', 'id'],
                                       where:{name:{[Op.iLike]: `${search}%`}},
                                       group: ['name', 'id'],
                                       limit: 20
                                      })
  res.json({results})
})
///////////////////////////////////// MAP /////////////////////////////////////////////

router.get('/map', authenticateToken, async (req, res)=>{
  const Posts = getPosts()
  const user = await User.findOne({where: {id: req.user.id}})

  const region = await Region.findOne({where: {id: user.RegionId}})
  const now = new Date()
  const oneYearAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365 )

  const pins = await Posts.find({"Region.id": region.id, guessed_animal: {$ne: null}, 
                                  createdAt: { $gte: oneYearAgo, $lte: now }}).toArray()

 
  console.log(pins)
  res.json({region:region, pins:pins, user:req.user.username})
})
module.exports = {router};

//////////////////REDIS///////////////////
const Redis = require("ioredis");
const redis = new Redis({ host: "localhost", port: 6379 });

/////////////////////////////////////////

const express = require('express');
const bcrypt = require('bcrypt'); // for password hashing
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const {getChannel} = require('./rabbit')
////////////////// BROKER ///////////////////////
const amqp = require('amqplib/callback_api')
/////////////////////////////////////////////////////

const { User, Post, Team, Badge, Region, Media, Animal, Comment, UserSettings
  ,Addresses, Followed , SubComment, UserBadge,
  UserStat} = require('./db');

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


const handleFiles = async (files, post)=>{
  try{

  
  
  if (files && files.length > 0){
    await Promise.all(
      files.map(async file => {
      Media.create({
            filename: file.filename,
            mimeType: file.mimetype,
            url: file.path,
            PostId: post.id
          })
      const channel = await getChannel()
      const payload = JSON.stringify({'path':file.path, 'postId': post.id})
      channel.sendToQueue('detect_animal', Buffer.from(payload))
      
    })
)}
   }catch(err2){
    console.log(err2)
   }
}
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

  const settings = await UserSettings.findOne({where: {UserId: req.params.id}})
 const attr = settings.showEmail
  ? { exclude: [] }
  : { exclude: ['email'] };

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
  res.json({user, settings, req_user: req_user, following:following !== null})
})


router.post('/unfollow/user/:id', authenticateToken, async (req, res)=>{
  const userid = req.params.id
  try {
     await Followed.destroy({where: {followerId: req.user.id, followingId: userid}})
  }catch(err){
    res.sendStatus(404)
  }
 res.sendStatus(200)
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
      res.sendStatus(200)
      
  }catch(err){
    console.log(err)
    res.sendStatus(400)
  }
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
   const settings = await UserSettings.findOne({where: {UserId: user.id}})
   const stats = await UserStat.findOne({where: {UserId: user.id}})
                                
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
  
  const post = await Post.create({title: data.title, content: data.content, 
    RegionId: user.RegionId, UserId: user.id, longitude: data.longitude, latitude: data.latitude })

  try {

  await redis.del('feed:world');
  await redis.del(`feed:region:${user.RegionId}`);

  }catch(err){
    console.log(err)
  }

  const files = req.files
  await handleFiles(files, post)


  res.redirect(`${process.env.FRONT_END_URL}/home`)
})


//
router.get('/home', authenticateToken, async (req, res) =>{
  const user = await User.findOne({where: {id: req.user.id},
                                  include: [{model: UserSettings}]})
 

  const scope = req.query.scope
  let region
  let posts
  let cached = null
  try {
    if (scope && scope === 'world'){
       region = null
    }
    else if (scope  && scope === 'region'){
        region = user.RegionId
    } 

    else{
        region = user.UserSetting.postScopeRegion ? user.RegionId : null
       }    

    try {

          if (scope == 'world'){
            cached = await redis.get("feed:world");
          }
          if (scope == 'region'){
            cached = await redis.get(`feed:region:${user.RegionId}`);
          }

      }catch(err){
        console.log(err)
      }

      if (cached){
        posts = JSON.parse(cached)

      }else{
          const followed = await Followed.findAll({where: {followerId: req.user.id}})  

          const arr = followed.map(follow => follow.followingId)

          const followedPostsNested = await Promise.all(
                arr.map(ar =>
                  Post.findAll({
                    where: region ? { RegionId: region, UserId: ar } : { UserId: ar },
                    order: [['id', 'DESC']],
                    limit: 2,
                    include: [
                      { model: Media, attributes: ['url'] },
                      { model: Region, attributes: ['display_name'] },
                      { model: User, attributes: ['username', 'picture', 'id'] }
                    ]
                  })
                )
              );
              const followedPosts = followedPostsNested.flat();


          const mainstreamPosts = 
                        await Post.findAll({
                        where: region ? { RegionId: region} : {}, 
                        order: [['id', 'DESC']], limit : 40, include:[ {
                          
                          model: Media,
                          attributes: ['url']
                        },
                        {
                          model: Region,
                          attributes: ['display_name']
                        },
                        {model: User, 
                        attributes: ['username', 'picture', 'id']}]

                      })

        const personalizedPosts = [...mainstreamPosts, ...followedPosts]
        const uniquePosts = Array.from(
        new Map(personalizedPosts.map(post => [post.id, post])).values()
      );

      posts = uniquePosts.sort(() => Math.random() - 0.5);

       if (scope == 'world'){
          await redis.set('feed:world',JSON.stringify(posts), "EX", 300)
          
        }
       if (scope == 'region'){
          await redis.set(`feed:region:${user.RegionId}`, JSON.stringify(posts), "EX", 300);
      }

      
    }
  
    res.json({posts, user: user.username, settings: user.UserSetting, region: region})
   

  

  }catch(err){
    console.log(err)
    res.status(500).send({'Error fetching posts': err})
  }


})
router.get('/images', async (req, res)=>{

})
router.delete('/comment/delete/:commentType/:commentId', authenticateToken, async (req, res)=>{
  const commentId = req.params.commentId
  const commentType = req.params.commentType
  try{
   commentType == 'comment' ? await Comment.destroy({where: {id: commentId}})
                            : await SubComment.destroy({where: {id: commentId}})
  }catch(err){
  
    console.log(err)
    res.sendStatus(404)
  }
  res.sendStatus(200)
})


router.get('/post/:id/comments',authenticateToken, async (req, res) => {
  const postId = parseInt(req.params.id)
 const comments = await Comment.findAll({
  where: { PostId: postId },
  include: [
    {
      model: User,
      attributes: ['picture', 'username', 'id']
    },
    {
      model: SubComment,
      include: [
        { model: User, attributes: ['picture', 'username', 'id'] },
        {
          association: 'children',   // subcomments of subcomments
          include: [
            { model: User, attributes: ['picture', 'username', 'id'] }
          ],
          distinct: true
        }
      ],
      distinct: true
    }
  ],
  order: [['id', 'DESC']],
  distinct: true
});

  
  res.json({comments})
})

router.post('/post/:id/comment/feed/:feed',authenticateToken, async (req, res) => {
  const postId = req.params.id
  const feed = req.params.feed
  const data = req.body
  const userId = req.user.id
  console.log(data.comment)
  const parentSubcomment = data.parentSub
  const parentComment = data.parent
  let commentId
  let comment
  if (parentComment){
    comment = await SubComment.create({content: data.comment, CommentId: parentComment, UserId: req.user.id})
    comment = `subcomment_${comment.id}`
  }
  else if (parentSubcomment){
     comment = await SubComment.create({content: data.comment, ParentId: parentSubcomment, UserId: req.user.id})
     comment = `subcomment_${comment.id}`
  } 
  else{
     comment = await Comment.create({content: data.comment, UserId: userId, PostId: postId})
     commentId = `top_comment_${comment.id}`
  }
 
  

  res.redirect(process.env.FRONT_END_URL + 
    `/home?post=${encodeURIComponent(postId)}&feed=${feed}&comment=${commentId}` )
})
router.delete('/post/:id', authenticateToken, async (req, res)=>{
  const id = req.params.id
  const post = await Post.findOne({where: {id: id}})
  if (req.user.id === post.UserId){
   await post.destroy()
   res.sendStatus(202)
  }
  else{
    res.sendStatus(401)
  }
})
router.post('/post/edit/:id', authenticateToken, upload.array('images', 5), async (req, res)=>{
  const id = req.params.id
  const data = req.body
  const post = await Post.findOne({where: {id: id}})
  post.title = data.title
  post.content = data.content
  data.latitude ? post.latitude = data.latitude : post.latitude = post.latitude
  data. longitude ? post.longitude = data.longitude: post.longitude = post.longitude
  // Delete old photos to replace them 
  if (req.user.id === post.UserId){
    const files = req.files
    if (files.length > 0){
     const photos = await Media.findAll({where: {PostId: post.id}})
     
     for (const photo of photos){
      fs.unlink(photo.url, (err)=>{
        if (err){
          console.log(err)
        }
      })
      await photo.destroy()
     }
     
        
    
        await handleFiles(files, post)
     }
     
     await post.save()
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
  const user = await User.findOne({where: {id: req.user.id}})

  const region = await Region.findOne({where: {id: user.RegionId}})
  const now = new Date()
  const oneYearAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365 )
  const pins = await Post.findAll({
                                    where: {RegionId: region.id, guessed_animal: {[Op.ne]: null},
                                    createdAt: {
                                                   [Op.between]: [oneYearAgo, now]}
                                    
                                  }}
  )
  res.json({region, pins})
})
module.exports = router;

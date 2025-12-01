


const express = require('express');
const bcrypt = require('bcrypt'); // for password hashing
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const {getChannel} = require('./rabbit')
////////////////// BROKER ///////////////////////
const amqp = require('amqplib/callback_api')
/////////////////////////////////////////////////////

const { User, Post, Team, Badge, Region, Media, Animal, Comment, UserSettings
  ,Addresses } = require('./db');

const router = express.Router();
router.use(express.json());

const authenticateToken = require('./jwt_middleware');

//////////////////// FILE STORAGE ///////////////////
const multer = require('multer')
const path = require('path');
const fs = require('fs')

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

  
  res.json({user, settings})
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
   const teams = await Team.findAll()
   const settings = await UserSettings.findOne({where: {UserId: user.id}})
   res.json({user, teams, settings})
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

  try{

  const files = req.files
   console.log(files)
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

  res.redirect(`${process.env.FRONT_END_URL}/home`)
})



router.get('/home', authenticateToken, async (req, res) =>{
  const user = await User.findOne({where: {id: req.user.id}})
  const region = user.RegionId
  try {
  const posts = await Post.findAll({
    where: {RegionId: region}, order: [['id', 'DESC']], limit : 50, include:[ {
      model: Media,
      attributes: ['url']
    },
    {model: User, attributes: ['username', 'picture', 'id']}]
  })

  console.log(posts)
  if (posts.length < 1){
    res.status(404).send('No posts for this region')
  }
  res.json({posts})

  }catch(err){
    res.status(500).send({'Error fetching posts': err})
  }


})
router.get('/images', async (req, res)=>{

})

router.get('/post/:id/comments',authenticateToken, async (req, res) => {
  const postId = parseInt(req.params.id)
  const comments = await Comment.findAll({include: {model: User, attributes: ['picture', 'username']} ,
    where: {PostId: postId}})
  res.json({comments})
})

router.post('/post/:id/comment',authenticateToken, async (req, res) => {
  const postId = req.params.id
  const data = req.body
  const userId = req.user.id
  console.log(data.comment)
  
  await Comment.create({content: data.comment, UserId: userId, PostId: postId})
  res.redirect(process.env.FRONT_END_URL + `/home?post=${encodeURIComponent(postId)}` )
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
router.post('/user_settings/edit', authenticateToken, async (req, res)=>{
  const data = req.body
  console.log(data)
  const settings = await UserSettings.findOne({where: {UserId: req.user.id}})
  
    data.email ? settings.showEmail = true : settings.showEmail = false
  
 
  await settings.save() 
  res.redirect(`${process.env.FRONT_END_URL}/dashboard`)
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
  const pins = await Post.findAll({
                                    where: {RegionId: region.id}
  })
  res.json({region, pins})
})
module.exports = router;




const express = require('express');
const bcrypt = require('bcrypt'); // for password hashing
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const {getChannel} = require('./rabbit')
////////////////// BROKER ///////////////////////
const amqp = require('amqplib/callback_api')
/////////////////////////////////////////////////////

const { User, Post, Team, Badge, Region, Media, Animal } = require('./db');

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
   res.json({user, teams})
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
    RegionId: user.RegionId, UserId: user.id })

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
    }]
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
  res.json({region})
})
module.exports = router;

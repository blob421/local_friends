const { Sequelize, DataTypes, Model } = require('sequelize');

 // const sequelize = new Sequelize('postgres://postgres:1246@postgres:5432/js-backend')
const sequelize = new Sequelize('postgres://postgres:1246@localhost:5432/js-backend')

///Squelize cli :
/// yarn sequelize-cli migration:generate --name add-users-table
/// edit the migration file 
/// yarn sequelize-cli db:migrate --env production

///////////////////////////// MODELS ////////////////////////////////

class User extends Model {}
User.init(
  {
    firstName: {type: DataTypes.STRING},
    lastName: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, allowNull: false},
    username: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    picture: {type: DataTypes.STRING},
    
    
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User', // We need to choose the model name
  },
);

class Region extends Model {}
Region.init({
  osm_id: {type: DataTypes.BIGINT},
  osm_type: {type: DataTypes.STRING},
  name: {type: DataTypes.TEXT},
  display_name: {type:DataTypes.STRING},
  county: {type: DataTypes.STRING},
  country: {type: DataTypes.STRING},
  country_code: {type: DataTypes.STRING},
  iso : {type: DataTypes.STRING},
  state: {type: DataTypes.STRING},
  kind: {type: DataTypes.STRING},
  bbox: {type: DataTypes.ARRAY(DataTypes.FLOAT)},
  location: {type: DataTypes.ARRAY(DataTypes.FLOAT)},

},
{
  sequelize,
  modelName: 'Region',
  timestamps: false
})
class Addresses extends Model{}
Addresses.init({
  street: { type: DataTypes.STRING},
  number: {type: DataTypes.STRING, allowNull: true},
  unit: {type: DataTypes.STRING, allowNull: true},
  city: {type: DataTypes.STRING, allowNull: true},
  district: {type: DataTypes.STRING, allowNull: true},
  region: {type: DataTypes.STRING,allowNull: true}, 
  latitude: {type: DataTypes.FLOAT},
  longitude : {type: DataTypes.FLOAT}

},
{
  sequelize,
  className: 'Address',
  timestamps: false
},
{
  indexes: [
    { fields: ['street'], using: 'BTREE' },
    { fields: ['number'], using: 'BTREE' },

  ]
})

class UserSettings extends Model{}
UserSettings.init(
  {
     showEmail: {type: DataTypes.BOOLEAN, defaultValue: false},
     postScopeRegion: {type: DataTypes.BOOLEAN, defaultValue: true}
  },
  {
    sequelize,
    className: 'UserSettings',
    timestamps: false
  }
)
class Comment extends Model {}
Comment.init(
  {
     content: {type: DataTypes.STRING, allowNull: false}
  },
  {
    sequelize,
    modelName : 'Comment'
  }
)
class Post extends Model {}
Post.init(
  {
   title:{type:DataTypes.STRING, allowNull:false},
   content: {type: DataTypes.TEXT, allowNull: false},
   guessed_animal : {type: DataTypes.STRING},
   latitude:{type: DataTypes.FLOAT},
   longitude: {type: DataTypes.FLOAT}
  
   

  },
  {
  sequelize,
  modelName: 'Post'
}
)

class UserStat extends Model {}
UserStat.init(
  {
    found: {type: DataTypes.INTEGER}
  },
  {
    sequelize,
    modelName: 'UserStat'
  }
)
class Team extends Model {}
Team.init(
  {
    name:{type:DataTypes.STRING, allowNull: false, unique:true},
  },
    {
    sequelize,
    modelName: 'Team'
  }
)
class Badge extends Model {}
Badge.init(
  {
    name: {type: DataTypes.STRING, allowNull: false},
  },
    {
    sequelize,
    modelName: 'Badge'
  }

)
class UserBadge extends Model {}
UserBadge.init(
  {
    // You can add extra fields here if needed, e.g.:
    awardedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    modelName: 'UserBadge'
  }
);

class Media extends Model {}
Media.init(
  {
    filename: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    mimeType:{type: DataTypes.STRING, allowNull:false},
    
  },
  { sequelize, modelName: 'Media' }
);

class Animal extends Model {}
Animal.init(
  {
    name: {type: DataTypes.STRING},
    description: {type:DataTypes.TEXT},
    picture: {type: DataTypes.STRING}
  },{
    sequelize,
    modelName: 'Animal'
  }
)

  class Followed extends Model{}
  Followed.init({
    followerId: {
      type: DataTypes.INTEGER, allowNull: false,

    },
    followingId: {
      type: DataTypes.INTEGER, allowNull: false,

  
    }

  },
      {
      sequelize,
      modelName: 'Followed',
      timestamps: false
    }
)




//////////////////////////// RELATIONS //////////////////////////////
Post.hasMany(Comment)
Post.hasMany(Media) // for include media in post
User.hasOne(Media)
Post.belongsTo(Animal)
User.belongsTo(Animal)
User.hasOne(UserSettings)

UserSettings.belongsTo(User, {
  onDelete: 'CASCADE'
})
Media.belongsTo(Post,{
  onDelete: 'CASCADE'
})

Comment.belongsTo(User, {
  onDelete: "CASCADE"
})

Badge.belongsTo(Team, {
  onDelete: "CASCADE"
})
User.belongsToMany(Badge, {
  onDelete: "CASCADE",
  through: 'UserBadge',
})

User.belongsToMany(User, {through: 'Followed', onDelete: 'CASCADE',  as: 'Followers', 
        foreignKey: 'followingId',  otherKey: 'followerId'})
User.belongsToMany(User, {through: 'Followed', onDelete: 'CASCADE',  as: 'Following', 
        foreignKey: 'followerId',  otherKey: 'followingId'})


Badge.belongsToMany(User,{
 onDelete: "CASCADE",
 through: 'UserBadge',
}
)
User.belongsTo(Team, {
  onDelete: 'SET NULL'
})
User.belongsTo(Region, {
  onDelete: 'SET NULL'
})

Post.belongsTo(Region, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})

Post.belongsTo(User, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

UserStat.belongsTo(User, {
  onDelete: 'CASCADE'
})


// the defined model is the class itself
console.log(User === sequelize.models.User); // true

module.exports = { sequelize, User, Post, Region, Team, Badge, Media, Animal, Comment, UserSettings,
  Addresses, UserStat, Followed
};
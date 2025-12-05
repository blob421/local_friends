module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {

   title:{type:DataTypes.STRING, allowNull:false},
   content: {type: DataTypes.TEXT, allowNull: false},
   guessed_animal : {type: DataTypes.STRING},
   latitude:{type: DataTypes.FLOAT},
   longitude: {type: DataTypes.FLOAT}

  });

  Post.associate=models=>{
      Post.hasMany(models.Comment)
      Post.hasMany(models.Media) // for include media in post
      Post.hasOne(models.Animal)
      Post.belongsTo(models.Region, {

          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        })

            Post.belongsTo(models.User, {
              
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        });
  }
  return Post
}
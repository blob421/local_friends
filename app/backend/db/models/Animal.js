

module.exports = (sequelize, DataTypes)=>{
  const Animal = sequelize.define('Animal', {
      name: {type: DataTypes.STRING},
      description: {type:DataTypes.TEXT},
      picture: {type: DataTypes.STRING}
  }
)
return Animal
}



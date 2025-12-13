
module.exports = (sequelize, DataTypes)=>{
  const UserStat = sequelize.define('UserStat', {
    found: {type: DataTypes.INTEGER, defaultValue: 0},
      followers: {type: DataTypes.INTEGER, defaultValue: 0},
        following: {type: DataTypes.INTEGER, defaultValue: 0}
  });
  UserStat.associate= models=>{
    UserStat.belongsTo(models.User, {
        onDelete: 'CASCADE'
})
  }
  return UserStat
}
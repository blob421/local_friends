
module.exports = (sequelize, DataTypes)=>{
  const UserStat = sequelize.define('UserStat', {
    found: {type: DataTypes.INTEGER}
  });
  UserStat.associate= models=>{
    UserStat.belongsTo(models.User, {
        onDelete: 'CASCADE'
})
  }
  return UserStat
}
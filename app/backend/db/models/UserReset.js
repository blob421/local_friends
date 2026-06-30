module.exports = (sequelize, DataTypes) => {

  const UserReset = sequelize.define('UserReset', {
       requestedAt : {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
       code: {type: DataTypes.INTEGER, allowNull: false}
  },
{
  timestamps: false
});
   UserReset.associate= models=>{
        UserReset.belongsTo(models.User, {
        onDelete: 'CASCADE'
         })
   }
  return UserReset
}
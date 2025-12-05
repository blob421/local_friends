
module.exports = (sequelize, DataTypes) => {
  const UserSettings = sequelize.define('UserSettings', {
     showEmail: {type: DataTypes.BOOLEAN, defaultValue: false},
     postScopeRegion: {type: DataTypes.BOOLEAN, defaultValue: true}
  },
{
  timestamps: false
});
  UserSettings.associate=models=>{
    UserSettings.belongsTo(models.User,  { onDelete: 'CASCADE' })
  }
  return UserSettings
}
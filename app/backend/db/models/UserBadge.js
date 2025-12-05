
module.exports = (sequelize, DataTypes) => {
  const UserBadge = sequelize.define('UserBadge', {
       awardedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
{
  timestamps: false
});
  return UserBadge
}
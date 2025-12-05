
module.exports = (sequelize, DataTypes) => {
  const UserBadge = sequelize.define('UserBadge', {
       awardedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
  return UserBadge
}
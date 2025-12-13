
// models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {type: DataTypes.STRING(16)},
    lastName: {type: DataTypes.STRING(20)},
    email: {type: DataTypes.STRING(35), allowNull: false},
    username: {type: DataTypes.STRING(25), allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    picture: {type: DataTypes.STRING},
  });

  User.associate = (models) => {
      User.hasOne(models.UserSettings, { onDelete: 'CASCADE' });
      User.hasOne(models.Media, { onDelete: 'CASCADE' });
      User.belongsTo(models.Team, { onDelete: 'SET NULL' });
      User.belongsTo(models.Animal, { onDelete: 'SET NULL' });
      User.belongsTo(models.Region, { onDelete: 'SET NULL' })
      User.belongsToMany(models.Badge, { through: 'UserBadge', onDelete: 'CASCADE' });
      
      User.belongsToMany(models.User, {through: 'Followed', onDelete: 'CASCADE',  as: 'Followers', 
        foreignKey: 'followingId',  otherKey: 'followerId',})
      User.belongsToMany(models.User, {through: 'Followed', onDelete: 'CASCADE',  as: 'Following',
        foreignKey: 'followerId',   otherKey: 'followingId',
      })
  };


  return User;
};


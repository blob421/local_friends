

module.exports = (sequelize, DataTypes)=>{
  const Badge = sequelize.define('Badge', {
     name: {type: DataTypes.STRING, allowNull: false},
  });
    Badge.associate = models=>{
            Badge.belongsTo(models.Team, {
          onDelete: "CASCADE"
        })

        Badge.belongsToMany(models.User,{
        onDelete: "CASCADE",
        through: 'UserBadge',
        }
        )
  }
  return Badge
}



module.exports = (sequelize, DataTypes) => {
  const Followed = sequelize.define('Followed', {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
 { timestamps: false

 });

  return Followed;
};
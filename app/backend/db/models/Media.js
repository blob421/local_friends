

module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define('Media', {

    filename: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    mimeType:{type: DataTypes.STRING, allowNull:false},

  });
  Media.associate = models =>{
    Media.belongsTo(models.Post,  { onDelete: 'CASCADE' })
  }
  return Media
} 
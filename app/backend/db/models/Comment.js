
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
      content: {type: DataTypes.STRING, allowNull: false}
  });

  Comment.associate= models=>{
    Comment.belongsTo(models.User, {
         onDelete: "CASCADE"
})
  }
  return Comment
}
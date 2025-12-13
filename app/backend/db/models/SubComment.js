module.exports = (sequelize, DataTypes) =>{
    const SubComment = sequelize.define('SubComment', {
        content: {type: DataTypes.STRING, allowNull: false}
    })
    SubComment.associate= (model) =>{
        SubComment.belongsTo(model.SubComment, {
          as: 'parent',
          foreignKey: 'ParentId'
        });
        
        SubComment.hasMany(model.SubComment, {
          as: 'children',
          foreignKey: 'ParentId'
        });
    }

    return SubComment
}

module.exports = (sequelize, DataTypes)=>{
  const Team = sequelize.define('Team', {
    name:{type:DataTypes.STRING, allowNull: false, unique:true},
  });
  return Team
}
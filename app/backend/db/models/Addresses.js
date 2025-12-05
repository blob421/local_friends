const { Sequelize, DataTypes, Model } = require('sequelize');


module.exports = (sequelize, DataTypes)=>{
   const Addresses = sequelize.define('Addresses', {
      street: { type: DataTypes.STRING},
      number: {type: DataTypes.STRING, allowNull: true},
      unit: {type: DataTypes.STRING, allowNull: true},
      city: {type: DataTypes.STRING, allowNull: true},
      district: {type: DataTypes.STRING, allowNull: true},
      region: {type: DataTypes.STRING,allowNull: true}, 
      latitude: {type: DataTypes.FLOAT},
      longitude : {type: DataTypes.FLOAT}
 },
 
 { timestamps: false

 }
)
return Addresses
}


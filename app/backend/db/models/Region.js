
module.exports = (sequelize , DataTypes) =>{
  const Region = sequelize.define('Region', {
  osm_id: {type: DataTypes.BIGINT},
  osm_type: {type: DataTypes.STRING},
  name: {type: DataTypes.TEXT},
  display_name: {type:DataTypes.STRING},
  county: {type: DataTypes.STRING},
  country: {type: DataTypes.STRING},
  country_code: {type: DataTypes.STRING},
  iso : {type: DataTypes.STRING},
  state: {type: DataTypes.STRING},
  kind: {type: DataTypes.STRING},
  bbox: {type: DataTypes.ARRAY(DataTypes.FLOAT)},
  location: {type: DataTypes.ARRAY(DataTypes.FLOAT)},
  },
{
  timestamps: false
});
return Region
}
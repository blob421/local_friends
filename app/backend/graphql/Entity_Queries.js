/////////////////////////////////////// IMPORTS ////////////////////////////////////////

const {Animal } = require('../db.js');
const { Op } = require("sequelize");

const {GraphQLString, GraphQLList} = require("graphql");
const {AnimalType} = require('./ORM_types.js')

/////////////////////////////////////// GET  ////////////////////////////////////////


  //****************************************************/    // Animals
 const EntityQueries = {

  animals: {          
      type:  new GraphQLList(AnimalType),                    // dashboard/editing_menus/animal_modal.tsx
      args: {name: {type: GraphQLString}},
      resolve: async (_, {name}) => {
        return Animal.findAll({
        attributes: ['name', 'id'],
        where:{name:{[Op.iLike]: `${name}%`}},
        group: ['name', 'id'],
        limit: 20
        })
      }
     },
 }  

 module.exports = EntityQueries

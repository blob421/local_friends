/////////////////////////////////////// IMPORTS ////////////////////////////////////////

const {Region, Addresses} = require('../db.js');
const { Op } = require("sequelize");

const {GraphQLString, GraphQLList} = require("graphql");
const {RegionType, AddressesType} = require('./ORM_types.js')

/////////////////////////////////////// GET ////////////////////////////////////////

const Location_Queries = {

      //****************************************************/   // Regions
    regions: {                                               
      type: new GraphQLList(RegionType),                        // frontend debounce.tsx , user-info-modala   
      args: {name: { type: GraphQLString }},
      resolve: async (_, { name }) => {                     
        return Region.findAll({
          attributes: ["id", "name"],
          distinct: true,
          where: { name: { [Op.iLike]: `${name}%` } },
          limit: 20
        });
      }
    },
     //****************************************************/ // Addresses
     addresses: {
      type: new GraphQLList(AddressesType),                  // create_modal.tsx , 
      args: {name: {type: GraphQLString}},
      resolve: async (_, {name}) => {
          const number =  name.match(/\d+/g);
          const string = name.replace(/\d+/g, "").trim();
          
          return Addresses.findAll({ where:{[Op.and] : [
                                                         {street:{[Op.iLike]: `${string}%`}},
                                                         {number:{[Op.iLike]: `${number? number: ""}%`}}
                                                        ]
                                                      },
                                    
                                            limit: 20})
      }
     }
}

module.exports = Location_Queries
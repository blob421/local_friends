const {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID, GraphQLInt, GraphQLFloat
} = require("graphql");

const RegionType = new GraphQLObjectType({
  name: "Region",
  fields: () => ({                                           // Prevent circular conflict 
    id: { type: GraphQLID },                                 // Graphql will call later
    name: { type: GraphQLString }
  })
});

const AddressesType = new GraphQLObjectType({
  name: "AddressSelector",
  fields: () => ({
    number: {type: GraphQLString},
    street: {type: GraphQLString},
    city: {type: GraphQLString},
    longitude: {type: GraphQLFloat},
    latitude: {type: GraphQLFloat}, 

  })
})

module.exports = {RegionType, AddressesType}
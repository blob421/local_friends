/////////////////////////////////////// IMPORTS ////////////////////////////////////////

const {GraphQLSchema, GraphQLObjectType} = require("graphql");

const EntityQueries = require('./Entity_Queries.js')
const Location_Queries = require('./Location_Queries.js')

/////////////////////////////////////// Queries ////////////////////////////////////////

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {...Location_Queries , ...EntityQueries}
});

const schema = new GraphQLSchema({
  query: QueryType
});

module.exports = { schema };

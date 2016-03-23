import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} from 'graphql';

const Schema = (db) => {
  const store = {};

  const companyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
      _id: {type: GraphQLInt},
      name: {type: GraphQLString},
      earnings: {type: GraphQLInt}
    })
  });

  const storeType = new GraphQLObjectType({
    name: 'Store',
    fields: () => ({
      companies: {
        type: new GraphQLList(companyType),
        resolve: () => db.collection('company').find({}).toArray()
      }
    })
  });

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: () => ({
        store: {
          type: storeType,
          resolve: () => store
        }
      })
    })
  });

  return schema;
};

export default Schema;

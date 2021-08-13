const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  geometryType: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [[Number]],
    required: true,
  },
});

const Feature = mongoose.model('Feature', featureSchema);

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Feature {
    id: ID!
    title: String!
    type: String
    geometryType: String!
    coordinates: [[Float!]!]!
  }
  type Mutation {
    deleteFeature(
      id: ID!
    ): String
    editFeature(
      id: ID!
      title: String!
      type: String
      geometryType: String!
      coordinates: [[Float!]!]!
    ): String
    addFeature(
      id: ID!
      title: String!
      type: String
      geometryType: String!
      coordinates: [[Float!]!]!
    ): String
  }
  type Query {
    allFeatures: [Feature!]!
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Mutation: {
    deleteFeature: async (root, args) => {
      console.log('delete feature: ', args);
      await Feature.findByIdAndDelete(args.id);
      return 'feature deleted';
    },
    editFeature: async (root, args) => {
      console.log('edit feature: ', args);
      await Feature.findByIdAndUpdate(args.id, args);
      return 'feature edited';
    },
    addFeature: async (root, args) => {
      console.log('add feature: ', args);
      const feature = new Feature({ ...args, _id: args.id });
      await feature.save();
      return 'feature added';
    },
  },

  Query: {
    allFeatures: async () => { const features = await Feature.find({}); console.log('features: ', features); return features; },
    hello: () => 'hello',
  },
};

const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const server = new ApolloServer({ typeDefs, resolvers, playground: true });

// for Heroku
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

// for Azure functions
// exports.graphqlHandler = server.createHandler();

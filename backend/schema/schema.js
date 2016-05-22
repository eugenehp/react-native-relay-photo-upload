var GraphQL = require('graphql')
var GraphQLRelay = require('graphql-relay')
import { connectionArgs, fromGlobalId, globalIdField, connectionFromArray, mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLInputObjectType, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLList } from 'graphql';
import { Image, getImage, getAnonymousImage, uploadImage } from './database';

// This module exports a GraphQL Schema, which is a declaration of all the
// types, queries and mutations we'll use in our system.

// Relay adds some specific types that it needs to function, including Node, Edge, Connection

// Firstly we need to create the Node interface in our system. This has nothing
// to do with Node.js! In Relay, Node refers to an entity – that is, an object
// with an ID.

// To create this interface, we need to pass in a resolving function as the
// first arg to nodeDefinitions that can fetch an entity given a global Relay
// ID. The second arg can be used to resolve an entity into a GraphQL type –
// but it's actually optional, so we'll leave it out and use isTypeOf on the
// GraphQL types further below.

var nodeDefinitions = GraphQLRelay.nodeDefinitions(function(globalId) {
  var idInfo = GraphQLRelay.fromGlobalId(globalId)
  if (idInfo.type == 'Image') {
    return getImage(idInfo.id)
  }
  return null
})

var imageType = new GraphQL.GraphQLObjectType({
  name: 'Image',
  description: 'An image entity',
  isTypeOf: function(obj) { return obj instanceof Image },

  // We use a closure here because we need to refer to widgetType from above
  fields: function() {
    return {
      id: GraphQLRelay.globalIdField('Image'),
      url: {
        type: GraphQL.GraphQLString,
        description: 'The URL of the image',
      }
    }
  },
  interfaces: [nodeDefinitions.nodeInterface],
})

// Now we can bundle our types up and export a schema
// GraphQL expects a set of top-level queries and optional mutations (we have
// none in this simple example so we leave the mutation field out)
module.exports = new GraphQL.GraphQLSchema({
  query: new GraphQL.GraphQLObjectType({
    name: 'Query',
    fields: {
      // Relay needs this to query Nodes using global IDs
      node: nodeDefinitions.nodeField,
      // Our own root query field(s) go here
      image: {
        type: imageType,
        resolve: function() { return getAnonymousImage() },
      },
    },
  }),

  mutation: new GraphQL.GraphQLObjectType({
    name: 'Mutation',
    fields: {
      image: mutationWithClientMutationId({
        name: 'ImageMutation',
        description: 'Upload image',
        inputFields: {
          title: {
            type: GraphQLString
          }
        },
        outputFields: {
          image: {
            type: imageType,
            description: 'Image entity',
            resolve: (payload) => payload.image
          },
          error: {
            type: GraphQLString,
            description: "Decsription of the error if anything",
            resolve: (payload) => payload.error
          }
        },
        mutateAndGetPayload: async ({ title }, { rootValue }) => {
          var file  = rootValue.request.file;
          let image = await uploadImage(title, file);
          let error = null;

          return {
            image:  image,
            error:  error
          }
        }
      })
    }
  })
})

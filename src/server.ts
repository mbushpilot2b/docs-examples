import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { typeDefs } from './typedefs.js';
import { resolvers } from './resolvers.js';
import { getUserFromToken, AuthContext, authenticateUser, generateToken } from './auth.js';
import { permissions } from './shield.js';

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Apply GraphQL Shield middleware to the schema
const schemaWithPermissions = applyMiddleware(schema, permissions);

// The ApolloServer constructor
export const server = new ApolloServer({
  schema: schemaWithPermissions,
});

// Context function to handle authentication
const context = async ({ req }: any): Promise<AuthContext> => {
  // Extract token from headers for simplicity (in production, use cookies)
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const user = token ? getUserFromToken(token) : undefined;

  return { user };
};

export { context };
